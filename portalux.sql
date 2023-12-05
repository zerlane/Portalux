CREATE DATABASE if not exists portalux;

CREATE TABLE if not exists portalux.Patients (
	id int NOT NULL auto_increment,
    first_name char(75) NOT NULL,
    last_name char(75) NOT NULL,
    dob date NOT NULL,
    address text NOT NULL, 
    email varchar(75) NOT NULL,
    phone varchar(10) NOT NULL,
    gender enum('Male', 'Female') NOT NULL,
    password varchar(60) NOT NULL,
    imgpwd varchar(60) NOT NULL,
    appointment_id int NULL,
    PRIMARY KEY (id)    
);

CREATE TABLE if not exists portalux.Doctors (
	id int NOT NULL auto_increment PRIMARY KEY,
    first_name char(75) NOT NULL,
    last_name char(75) NOT NULL,
    email varchar(75) NOT NULL,
    phone varchar(10) NOT NULL,
    specialty varchar(25) NOT NULL,
    appointment_id int NULL
);

CREATE TABLE if not exists portalux.Appointments (
	id int NOT NULL auto_increment,
    appointment_date date NOT NULL,
    appointment_time time NOT NULL,
    duration time NOT NULL,
    created timestamp default current_timestamp NOT NULL, 
    current_status enum('Free','Active') NOT NULL,
    patient_id int NULL,
    doctor_id int NULL,
    PRIMARY KEY (id),
	FOREIGN KEY (patient_id) REFERENCES portalux.Patients(id),
    FOREIGN KEY (doctor_id) REFERENCES portalux.Doctors(id)
);

CREATE TABLE if not exists portalux.DoctorAvailability (
	id int NOT NULL auto_increment,
    available_date date NULL,
    start_time time NULL,
	doctor_id int NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (doctor_id) REFERENCES portalux.Doctors(id)
); 

ALTER TABLE portalux.Patients ADD FOREIGN KEY (appointment_id) REFERENCES portalux.Appointments(id);
ALTER TABLE portalux.Doctors ADD FOREIGN KEY (appointment_id) REFERENCES portalux.Appointments(id);

ALTER TABLE portalux.Patients AUTO_INCREMENT=100000000;
ALTER TABLE portalux.Doctors AUTO_INCREMENT=100000;

ALTER TABLE portalux.DoctorAvailability MODIFY COLUMN available_date DATETIME;

SET FOREIGN_KEY_CHECKS=0;


#ChatGPT assisted with creating this trigger.
DELIMITER $$
/*
	This trigger updates the Appointment table when the doctor's availability is added to the doctor's availabilty. It is assumed the all
    appointments are in 30 minute increments.
*/
CREATE TRIGGER PopulateAvail
AFTER INSERT ON portalux.DoctorAvailability
FOR EACH ROW
BEGIN 
	DECLARE start_time TIME;
    DECLARE end_time TIME;
    SET start_time = NEW.start_time;
    SET end_time = ADDTIME(NEW.start_time, '00:30:00');
    
    WHILE start_time < NEW.end_time DO
		INSERT INTO portalux.Appointments (doctor_id, appointment_date, appointment_time, duration, current_status)
        VALUES (NEW.doctor_id, NEW.available_date, start_time, '00:30:00', 'Free');
        SET start_time = addtime(start_time, '00:30:00');
	END WHILE;
END;
$$
DELIMITER ;


# ChatGPT assisted with creating procedure
DELIMITER //
/* 
	This procedure is created to update the appointment table with the corresponding patient_id
    while simutaneously updating the patient table with the appointment_id when scheduled.
*/
CREATE PROCEDURE ScheduleAppt (IN s_appt_id int, IN s_patient_id int)

BEGIN
	DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
		SHOW ERRORS;
		ROLLBACK;
	END;
    
    START TRANSACTION;
    
    #update appointment table
    UPDATE Appointments
	SET current_status = 'Active', patient_id = s_patient_id
	WHERE id = s_appt_id;
	
    IF ROW_COUNT() = 0 THEN
		ROLLBACK;
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error updating Appointment table when scheduling appointment';
	END IF;
    
    #update patient table
    UPDATE Patients
	SET appointment_id = s_appt_id
	WHERE id = s_patient_id;
	
    IF ROW_COUNT() = 0 THEN
		ROLLBACK;
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error updating Patient table when scheduling appointment';
	END IF;
    
    COMMIT;
END //

DELIMITER ;

# ChatGPT assisted with creating procedure
DELIMITER //
/* 
	This procedure is created to update the appointment table with the corresponding patient_id
    while simutaneously updating the patient table with the appointment_id when cancelled.
*/
CREATE PROCEDURE CancelAppt (IN s_appt_id int, IN s_patient_id int)

BEGIN
	DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
		SHOW ERRORS;
		ROLLBACK;
	END;
    
    START TRANSACTION;
    
    #update appointment table
    UPDATE Appointments
	SET current_status = 'Free', patient_id = NULL
	WHERE id = s_appt_id;
	
    IF ROW_COUNT() = 0 THEN
		ROLLBACK;
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error updating Appointment table when scheduling appointment';
	END IF;
    
    #update patient table
    UPDATE Patients
	SET appointment_id = NULL
	WHERE id = s_patient_id;
	
    IF ROW_COUNT() = 0 THEN
		ROLLBACK;
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error updating Patient table when scheduling appointment';
	END IF;
    
    COMMIT;
END //

DELIMITER ;
