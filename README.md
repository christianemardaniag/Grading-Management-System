# Grading Manegement System
[ADMIN Prototype](https://www.canva.com/design/DAFCEEyCcrQ/672SjYj7Klssa7LMEWNzZA/edit#)

[Faculty Prototype](https://www.canva.com/design/DAFB99XhFqo/U8Zw-RffFNYc748Dzy1o8g/edit?utm_content=DAFB99XhFqo&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton#)

[Student Prototype](https://www.canva.com/design/DAFCDf8idHE/xofDxLTk7EwPfY73NEkBZw/edit?utm_content=DAFCDf8idHE&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton)
### Features

## ADMIN
#### ~~1. Login~~ 
- ~~Admin have different page for login and can be access via URL http://localhost/Grading-Management-System/gms-admin~~
- ~~Admin can sign in using their username or email address~~
- ~~Admin can use forgot password and enter the registered email to send a new random password to the email~~
- ~~Admin cannot be block by the system~~

#### 2. Dashboard
- Display total count of __Faculty__
- Display total count of __Students__
    - Per speciazation
- Student Passing Rate
- and more.. (to follow)

#### 3. Report (ADDITIONAL MENU)
- Display list of Faculty information (table)
- Display list of Student information (table)
- Admin can print all students or faculty reports or individual sections

#### 4. Faculty
- ~~List of all faculty~~
- ~~Search Bar: Faculty name, Employee No, email address~~
- List of handled students per faculty
- List of handled subject
- Can print individual faculty with handled students
- Can add/edit/archive new faculty
- ~~Admin will provide email and username to faculty for login~~
- The system will automatically send password to faculties email address after account creation
- ~~can upload excel file with __specific format__~~

#### 5. Student
- Upload and download list of students (excel file)
- Add/Edit/Archive students

#### 6. Subject
- List of all subject per year, semester, and specialization
- Admin can add/edit/delete subject
- Search bar: Subject Title, Subject Code, Units
- List of faculty teaching specific subject
- Assign faculty to specific subject

#### 7. Settings (Replacement to Criteria)
- __ANNOUNCEMENT__ (ADDITIONAL)
    - Add/Edit/Delete announcement to the page
    - Two different type of announcement
        - Announcement for faculties
        - Announcement for students
- __CRITERIA__
    - Add/Edit/Delete grading criteria
    - Grading criteria percentage total should not be exceed to 100%
- Blocked User

#### ~~8. Profile~~
- ~~Admin can edit their information (Username, Email, Password)~~


## FACULTY
#### 1. Login
- Faculty login page will be visible on the home page of the system as well as student login page 
- Faculty can login using __username__ or __email address__
- Faculty can be block by the system after maximum of 3 login attempts
- Faculty can be unblock by the admin
- Faculty can use forgot password and enter their registered email to receive a new random password via email

#### 2. Dashboard
- Display __current__ total number of handled students per sem including all section
- Display __current__ bar graph chart for total number of students __per section__
- Display all assigned subjects (Table)
- and more.. (to follow)

#### 3. Student
- List of all students per year and semester
- Faculty can change student status to drop
- Print specific student

#### 4. Grade
- List of all handled students per subject
- Upload and download student grade __per subject__
- Can add/edit/delete quiz, activities, and exam
- https://frappe.io/datatable
- https://github.com/datazenit/sensei-grid

#### 5. Chat
- Can chat co-faculty and students
- Can upload and download file (max limit 3mb file size)
- Refresh chat box every 1 second
- View Contacts

#### 6. Profile
- Faculty can edit their information (Username, Email, Password)

## Student
#### 1. Login
- Student login page will be visible on the home page of the system as well as faculty login page 
- Student can login using __username__ or __email address__
- Student can be block by the system after maximum of 3 login attempts
- Student can be unblock by the admin
- Student can use forgot password and enter their registered email to receive a new random password via email

#### 2. Dashboard
- Display personal information
- can edit their information
- Display current subjects
- and more (to follow)

#### 3. Grade (Replacement to Subject)
- List of all subject enrolled
- Input grade and preview possible final grade
- Download grade
- 

#### 4. Chat
- Can chat co-students and faculty
- Can upload and download file (max limit 3mb file size)
- Refresh chat box every 1 second
- View Contacts
