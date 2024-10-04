import User from "../models/user.js";
import Points from "../models/userPoints.js";
import Agency from "../models/compostAgency.js";
import History from "../models/history.js";
import Transaction from "../models/transaction.js";
import { redeemReward } from "../mailer/rewardRedeem.js";
import { suppliesRequest } from "../mailer/suppliesRequest.js";
import dotenv from 'dotenv';
import axios from 'axios';
dotenv.config();

// Controller to provide the list of all nearby composting agencies to the user
export const nearby_agency = async (req, res) => {
    try {
        const role = req.params.role;
        let users = await User.find({ role: role }, { name: 1, username: 1, role: 1, location: 1, contact: 1, address: 1 }).lean();
        let nearbyAgency = [];
        let location = await User.findById(req.user.id);
        location = location.location;

        if (!location) {
            return res.status(422).json({ message: "Location not updated!" });
        }

        for (const user of users) {
            const apiKey = process.env.apiKey;
            const startCoordinates = location;
            const endCoordinates = user.location;
            if (!endCoordinates) continue;

            const traffic = true;
            const tomtomApiEndpoint = 'https://api.tomtom.com/routing/1/calculateRoute/';
            const url = `${tomtomApiEndpoint}${startCoordinates}:${endCoordinates}/json?key=${apiKey}&traffic=${traffic}`;

            const response = await axios.get(url);
            const data = response.data;
            const route = data.routes && data.routes[0];

            if (route) {
                const distance = route.summary.lengthInMeters / 1000; // in km
                const travelTime = route.summary.travelTimeInSeconds / 60; // in mins
                if (distance < 10) {
                    user.distance = distance;
                    user.travelTime = travelTime;
                    nearbyAgency.push(user);
                }
            }
        }

        return res.status(201).json({ nearbyAgency: nearbyAgency });
    } catch (error) {
        console.log('Error: ', error.message);
        return res.status(500).json({ error: 'Server Error!' });
    }
}

// Making a donation request to compost agency or NGO
export const donate_supplies = async (req, res) => {
    try {
        let agency = await User.findOne({ username: req.body.username });
        let status = req.body.type === 'ngo' ? 'accepted' : 'pending';
        
        let transaction = await Transaction.create({
            sender: req.user.username,
            receiver: req.body.username,
            type: req.body.type,
            quantity: req.body.quantity,
            points: req.body.quantity * 10, // 1kg = 10 points
            status: status
        });

        suppliesRequest(agency, req.user, transaction);
        return res.status(200).json({ message: "Request sent to Agency/NGO!" });
    } catch (error) {
        console.log('Error: ', error.message);
        return res.status(500).json({ error: 'Server Error!' });
    }
}

// Displaying the list of agencies where user has donated from where he can get the reward
export const reward_store = async (req, res) => {
    try {
        let agencies = await Points.findOne({ user: req.user.username }, { availablePoints: 1 }); 
        agencies = agencies.availablePoints;
        let userRewards = [];

        if (agencies) {
            for (let agency of agencies) {
                let rewards = await Agency.findOne({ user: agency.agency }, { reward: 1 });
                rewards = rewards.reward;

                let { username, name } = await User.findOne({ username: agency.agency }, { username: 1, name: 1 });
                userRewards.push({ username: username, name: name, rewards: rewards, userPoints: agency.points });
            }
            return res.status(200).json({ message: 'Agency data fetched!', userRewards: userRewards });
        }
        return res.status(200).json({ message: 'Agency data fetched!', userRewards: null });
    } catch (error) {
        console.log('Error: ', error);
        return res.status(500).json({ error: error });
    }
}

// Redeem the reward and subtract the money
export const reedem_reward = async (req, res) => {
    try {
        const { reward, username } = req.body;
        const sender = await User.findOne({ username: username });
        
        if (!sender) {
            return res.status(404).json({ message: "Sender not found!" });
        }

        // Create history entry
        await History.create({
            sender: sender.username,
            receiver: req.user.username,
            reward: reward
        });

        // Update points for the user under a specific agency
        await Points.findOneAndUpdate(
            { user: req.user.username, "availablePoints.agency": sender.username },
            { $inc: { "availablePoints.$.points": -reward.point } },
            { new: true }
        );

        // Send reward redemption confirmation email (optional)
        redeemReward(sender, req.user, reward);

        return res.status(200).json({ message: "Points updated and reward redeemed successfully!" });
    } catch (error) {
        console.log('Error: ', error);
        return res.status(500).json({ error: error });
    }
}
