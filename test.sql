CREATE TABLE users (
  id bigint NOT NULL AUTO_INCREMENT, 
  first_name varchar(50),
  last_name varchar(50),
  email varchar(100),
  account_type ENUM('reg', 'admin'),
  PRIMARY KEY(id)
);

CREATE TABLE posts (
  id bigint NOT NULL AUTO_INCREMENT, 
  text varchar(256),
  uid bigint NOT NULL,
  PRIMARY KEY(id),
  FOREIGN KEY (uid) REFERENCES users(id)
);

CREATE TABLE messages (
  id bigint NOT NULL AUTO_INCREMENT, 
  text varchar(256),
  uid_to bigint NOT NULL,
  uid_from bigint NOT NULL,
  PRIMARY KEY(id),
  FOREIGN KEY (uid_to) REFERENCES users(id),
  FOREIGN KEY (uid_from) REFERENCES users(id)
);
