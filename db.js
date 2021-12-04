const DBConnect = mongoose.connect(
    process.env.DB_CONNECT,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
    },
    (err) => {
        if (err) return console.error(err);
        console.log("connect to MongoDb");
    }
);

const DBConnect = async () => {
    try {
        const db_connect = await mongoose.connect(process.env.DB_CONNECT, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
        });
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};
