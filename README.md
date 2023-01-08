# Grading Manegement System

[ADMIN Prototype](https://www.canva.com/design/DAFCEEyCcrQ/672SjYj7Klssa7LMEWNzZA/edit#)

[Faculty Prototype](https://www.canva.com/design/DAFB99XhFqo/U8Zw-RffFNYc748Dzy1o8g/edit?utm_content=DAFB99XhFqo&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton#)

[Student Prototype](https://www.canva.com/design/DAFCDf8idHE/xofDxLTk7EwPfY73NEkBZw/edit?utm_content=DAFCDf8idHE&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton)

### Features

## ADMIN

#### 1. Login

- Admin have different page for login and can be access via URL <http://localhost/Grading-Management-System/gms-admin>
- Admin can sign in using their username or email address
- Admin can use forgot password and enter the registered email to send a new random password to the email
- Admin cannot be block by the system

#### 2. Dashboard

- Numer of Students
- Passing rate per subject
- Passing rate per year level
- Number of candidate for Academic Honor
- Number of candidate for Excellence Award
- Unofficial Drop Student

#### 3. Faculty

- List of Blocked Faculty
- List of all faculty
- List of handled subject per faculty
- Can print individual faculty with handled students
- Can add/edit/archive new faculty
- Admin will provide username to faculty for login
  - Username, ID number and email are subject for duplication
- The system will automatically send password to faculty email address after account creation
- can upload excel file with __specific format__

#### 4. Student

- List of Blocked Student
- List of Alumni
- List of Regular Student
- Filter: Year Level, Section
- Upload and download list of students (excel file)
- Add/Edit/Archive students

#### 5. Honors

- List of candidate for academic honors
- List of candidate for excellence award

#### 6. Subject

- List of all subject
- Admin can add/edit/delete subject
- Filter: year level

#### 7.  Criteria

- Add/Edit/Delete grading criteria
 
#### 8. Profile

- Admin can edit their information (Username, Email, Password)

## FACULTY

#### 1. Login

- Faculty login page will be visible on the home page of the system as well as student login page
- Faculty can login using __username__ or __email address__
- Faculty can be block by the system after maximum of 3 login attempts
- Faculty can be unblock by the admin
- Faculty can use forgot password and enter their registered email to receive a new random password via email

#### 2. Dashboard

- Display __current__ total number of handled students
- Criteria Grade Average per subject
- Display top 10 students over all section per subject
- Unofficial Drop
    
#### 3. Student

- List of all students
- Filter: Subject, Section
- Print specific student

#### 4. Grade

- List of all handled students per subject
- Upload and download student grade __per subject__
- Can add/edit/delete grade
- Faculty can change student status to drop
- Top 10 Students Table
- Failed Students Table 

#### 5. Profile

- Faculty can edit their information (Username, Email, Password)

## Student

#### 1. Login

- Student login page will be visible on the home page of the system as well as faculty login page
- Student can login using __username__ or __email address__
- Student can be block by the system after maximum of 3 login attempts
- Student can be unblock by the admin
- Student can use forgot password and enter their registered email to receive a new random password via email

#### 2. Dashboard

- Display GWA
- GWA per year level
- grade per year level per subject 
- Display Award

#### 3. Grade (Replacement to Subject)

- List of all subject enrolled
- Filter: Year level semester
- Input grade and preview possible final grade

#### 4. Subject

- Display all subject

#### 5. Profile

- Display personal information
- can edit their information
