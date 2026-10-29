const { Teacher, Student, Admin } = require('./Users');
const { Course, Subject, Timetable, TeacherSubjectAssignment } = require('./Academics');
const { Attendance, Assignments, Marks } = require('./Activities');
const { LearningResource, StudyMaterial, Notes, Library } = require('./Resources');
const { Notices, Leave, Fee, Report, Notification, Settings } = require('./Operations');

module.exports = {
    // Users
    Teacher, Student, Admin,
    // Academics
    Course, Subject, Timetable, TeacherSubjectAssignment,
    // Activities
    Attendance, Assignments, Marks,
    Assignment: Assignments,
    // Resources
    LearningResource, StudyMaterial, Notes, Library,
    LibraryBook: Library,
    // Operations
    Notices, Leave, Fee, Report, Notification, Settings,
    Notice: Notices
};
