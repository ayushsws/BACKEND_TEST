const User = require('./models/User');
const Item = require('./models/Item');
const Expense = require('./models/Expense');
const jwt = require('jsonwebtoken');

const SECRET = 'your-secret-key';

const resolvers = {
    Query: {
        items: async () => await Item.find(),
        users: async () => await User.find(),
        userExpenses: async (_, { userId }, { userId: contextUserId }) => {
            // Use the userId from the argument if provided, otherwise fall back to context
            const idToUse = userId || contextUserId;

            if (!idToUse) {
                throw new Error('User ID is required to fetch expenses.');
            }

            return await Expense.find({ user: idToUse }).populate('item');
        },
    },
    Mutation: {
        register: async (_, { name, email, password }) => {
            const user = new User({ name, email, password });
            await user.save();
            const token = jwt.sign({ userId: user.id }, SECRET, { expiresIn: '1h' });
            return { token, user };
        },
        login: async (_, { email, password }) => {
            const user = await User.findOne({ email });
            if (!user) throw new Error('User not found');
            const valid = await user.comparePassword(password);
            if (!valid) throw new Error('Invalid password');
            const token = jwt.sign({ userId: user.id }, SECRET, { expiresIn: '1h' });
            return { token, user };
        },
        addItem: async (_, { name, price }) => {
            const item = new Item({ name, price });
            return await item.save();
        },
        addExpense: async (_, { userId, itemId }) => {
            const expense = new Expense({
                user: userId,
                item: itemId,
                date: new Date(),
            });
            return await expense.save();
        },
    },
};

module.exports = resolvers;
