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

function add_assessment(term, course, name) {
    if (_is_undefined(localStorage[term])) {
        return 'no such term';
    }

    var courses = JSON.parse(localStorage[term]);
    if (!(course in courses)) {
        return 'no such course';
    }

    var details = courses[course];
    if (details['details'] == null) { // first assessment
        var new_details = {};
        new_details[name] = null;
        details['details'] = new_details;
        courses[course] = details;
        localStorage[term] = JSON.stringify(courses);
    }

    var existing_details = details['details'];
    existing_details[name] = null;
    details['details'] = existing_details;
    courses[course] = details;
    localStorage[term] = JSON.stringify(courses);
}

function get_assessments(term, course) {
    if (_is_undefined(localStorage[term])) {
        return 'no such term';
    }

    var courses = JSON.parse(localStorage[term]);
    if (!(course in courses)) {
        return 'no such course';
    }

    var details = courses[course];
    var assessments = details['details'];
    return JSON.stringify(Object.keys(assessments));
}