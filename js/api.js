/**
 * Created by xandros on 11/12/2014.
 */

function _is_undefined(object) {
    return  typeof(object) == 'undefined';
}

function get_terms() {
    return Object.keys(localStorage);
}

function add_term(term) {
    if (_is_undefined(localStorage[term])) { //new term
        localStorage[term] = JSON.stringify(null);
        return 'success';
    }
    return 'term already exists';
}

function add_course(term, name, goal) {
    if (_is_undefined(localStorage[term])) {
        return 'no such term';
    }

    var courses = JSON.parse(localStorage[term]);
    var details = {};
    details['goal'] = goal;
    details['distance'] = 0;
    details['details'] = null;
    if (courses == null) { // no courses
        var new_course = {};
        new_course[name] = details;
        localStorage[term] = JSON.stringify(new_course);
        return 'success';
    }

    if (name in courses) {
        return 'course exists';
    }

    courses[name] = details;
    localStorage[term] = JSON.stringify(courses);
    return 'success';
}

function get_courses(term) {
    if (_is_undefined(localStorage[term])) {
        return 'no such term';
    }
    var courses = JSON.parse(localStorage[term]);
    return Object.keys(courses);
}

function add_assessment(term, course, name, weight) {
    if (_is_undefined(localStorage[term])) {
        return 'no such term';
    }

    var courses = JSON.parse(localStorage[term]);
    if (courses == null || !(course in courses)) {
        return 'no such course';
    }

    var mark_info = {};
    mark_info['weight'] = weight;
    if (courses[course] == null) { // no assessments
        //mark_info['mark'] = mark;
        var assessment = {};
        assessment[name] = mark_info;
        courses[course] = assessment;
        localStorage[term] = JSON.stringify(courses);
        return 'success';
    }

    var assessments = courses[course]; // get assessments of a course
    assessments[name] = mark_info;
    courses[course] = assessments;
    localStorage[term] = JSON.stringify(courses);
    return 'success';
}

function get_assessments(term, course) {
    if (_is_undefined(localStorage[term])) {
        return 'no such term';
    }

    var courses = JSON.parse(localStorage[term]);
    if (courses == null || !(course in courses)) {
        return 'no such course';
    }

    var assessments = courses[course];
    return JSON.stringify(assessments);
}