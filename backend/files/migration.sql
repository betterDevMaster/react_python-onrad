CREATE TABLE "users" (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	name TEXT NOT NULL,
	passwd TEXT,
	backend TEXT,
	frontend TEXT,
	email TEXT,
	props INTEGER, 
	status INTEGER, 
	lastAccess DATETIME, 
	manager INTEGER,
	UNIQUE(name)
);
INSERT INTO users (name,passwd,backend,frontend,email,props,status,lastAccess,manager) VALUES ('root','202cb962ac59075b964b07152d234b70','*','*','admin@maciel.com',3,0,NULL,1);

CREATE TABLE origin (
	id INTEGER,
	port INTEGER,
	ae_title TEXT,
	modality_ignore TEXT,
	time_upload INTEGER,
	time_new_study INTEGER,
	UNIQUE(id)
);
INSERT INTO origin (id,port,ae_title,modality_ignore,time_upload,time_new_study) VALUES (83,11112,'SERVIDOR','SR',1,48*60);

CREATE TABLE s3 (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	username TEXT NOT NULL,
	passwd TEXT,
	access_key_id TEXT,
	secret_access_key TEXT,
    bucket_name TEXT,
	console TEXT,
    active INTEGER,
    UNIQUE(username)
);
INSERT INTO s3 (username,passwd,access_key_id,secret_access_key,bucket_name,console,active) VALUES ('VictorSagatio','','AKIAWYSW5YTGWCTIECPQ','uQeQCrIjt8w4lmwvhS9lUPuNjbbhtvZ3MRSuBY4d','new-hub-test','https://2msolutions.signin.aws.amazon.com/console
',1);

CREATE TABLE sender (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	host TEXT NOT NULL,
	port TEXT,
	ae_title TEXT,
	active INTEGER,
    UNIQUE(host)
);
INSERT INTO sender (host,port,ae_title,active) VALUES ('radiologia.ag','11112','DCM4CHEE',0);


CREATE TABLE `history` (
    `id` VARCHAR(127) PRIMARY KEY, 
	`origin_id` VARCHAR(31),
	`origin_name` VARCHAR(255),
    `record_time` DATETIME, 
    `cloud_file_path` VARCHAR(255),
    `modality` VARCHAR(31),
    `patient_id` VARCHAR(31),
    `patient_name` VARCHAR(127),
    `patient_sex` VARCHAR(7),
    `patient_age` VARCHAR(31),
    `patient_birthday` VARCHAR(63),
    `exam` VARCHAR(127),
    `accession_number` VARCHAR(255),
    `study_id` VARCHAR(127),
    `study_uid` VARCHAR(127),
    `referring_physicians_name` VARCHAR(31),
    `performing_physicians_name` VARCHAR(31),
    `study_date` VARCHAR(63)
);

CREATE TABLE onroad (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	url TEXT NOT NULL,
	"user" TEXT(127) NOT NULL,
	passwd TEXT(127) NOT NULL,
	etc TEXT
);

CREATE TABLE study (
	studyUID TEXT(63) NOT NULL,
	studyID TEXT(31) NOT NULL,
	originId TEXT(15) NOT NULL,
	originName TEXT(31) NOT NULL,
);

INSERT INTO study (studyUID,studyID,originId,originName) VALUES ('1.2.40.0.13.20200729095455.1392973','2430195','9','Demo');
INSERT INTO study (studyUID,studyID,originId,originName) VALUES ('1.2.392.200036.9107.500.111234520101306803','2430196','9','Demo');
INSERT INTO study (studyUID,studyID,originId,originName) VALUES ('910910','2430197','9','Demo');
INSERT INTO study (studyUID,studyID,originId,originName) VALUES ('1.2.840.113564.10101100.202010140745299841','2430198','9','Demo');
INSERT INTO study (studyUID,studyID,originId,originName) VALUES ('1.2.840.113619.2.55.3.168429825.821.1602668593.38','2430199','9','Demo');
