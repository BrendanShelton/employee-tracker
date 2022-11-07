INSERT INTO department (name)
VALUES ("department1"),
       ("department2");

INSERT INTO role (title, salary, department_id)
VALUES  ("manager1", 100000, 1),
        ("manager2", 100000, 2),
        ("worker1", 50000, 1),
        ("worker2", 50000, 2);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES  ("firstname1", "lastname1", 1, NULL),
        ("firstname2", "lastname2", 2, 1),
        ("firstname3", "lastname3", 3, NULL),
        ("firstname4", "lastname4", 4, 2);