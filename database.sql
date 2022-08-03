
-- USER is a reserved keyword with Postgres
-- You must use double quotes in every query that user is in:
-- ex. SELECT * FROM "user";
-- Otherwise you will have errors!
CREATE TABLE "user" (
    "id" SERIAL PRIMARY KEY,
    "username" VARCHAR (80) UNIQUE NOT NULL,
    "password" VARCHAR (1000) NOT NULL,
    "tarkov_name" VARCHAR (80) UNIQUE NOT NULL,
    "tarkov_level" INT NOT NULL,
    "access_level" INT DEFAULT 0
);

CREATE TABLE "messages" (
    "id" SERIAL PRIMARY KEY,
    "description" VARCHAR(300),
    "time" VARCHAR(100),
    "user_id" INT REFERENCES "user"
);

CREATE TABLE "private_messages" (
    "id" SERIAL PRIMARY KEY,
    "message" VARCHAR(300),
    "time" VARCHAR(100),
    "user_id" INT REFERENCES "user"
);

CREATE TABLE "user_private_messages" (
    "id" SERIAL PRIMARY KEY,
    "message_id" INT REFERENCES "private_messages" ON DELETE CASCADE,
    "sender_user_id" INT REFERENCES "user",
    "receiver_user_id" INT REFERENCES "user"
);

CREATE TABLE "feedback" (
    "id" SERIAL PRIMARY KEY,
    "rating" INT,
    "comment" VARCHAR(300),
    "time" VARCHAR(100),
    "sender_user_id" INT REFERENCES "user",
    "receiver_user_id" INT REFERENCES "user"
);
