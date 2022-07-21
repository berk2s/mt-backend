db.createUser({
    user: "tt-user",
    pwd: "tt-password",
    roles: [{
        role: "readWrite",
        db: "traintogether"
    }]
});