/**
 * Created by xandros on 11/12/2014.
 */

function _is_undefined(object) {
    return  typeof(object) == 'undefined';
}

function get_terms() {
    var terms = JSON.parse(localStorage['gpa_user']);
    return Object.keys(terms);
}

function add_term(term) {
    if (_is_undefined(localStorage['gpa_user'])) { //new term
        localStorage['gpa_user'] = null;
    }

    var terms = JSON.parse(localStorage['gpa_user']);
    if (terms == null) {
        var new_term = {};
        new_term[term] = null;
        localStorage['gpa_user'] = JSON.stringify(new_term);
        return 'success';
    }

    if (term in terms) {
        return 'term already exists';
    }

    terms[term] = null;
    localStorage['gpa_user'] = JSON.stringify(terms);
    return 'success';
}

function add_course(term, name, goal) {
    if(_is_undefined(localStorage['gpa_user'])) {
        return 'nothing in storage';
    }

    var terms = JSON.parse(localStorage['gpa_user']);
    if (!(term in terms)) {
        return 'no such term';
    }

    var details = {};
    details['goal'] = goal;
    details['distance'] = 0;
    details['details'] = null;
    var courses = terms[term];
    if (courses == null) {
        var new_course = {};
        new_course[name] = details;
        courses = new_course;
        terms[term] = courses;
        localStorage['gpa_user'] = JSON.stringify(terms);
        return 'success';
    }

    if(name in courses) {
        return 'name exists';
    }

    courses[name] = details;
    terms[term] = courses;
    localStorage['gpa_user'] = JSON.stringify(terms);
    return 'success';
}

function get_courses(term) {
        if(_is_undefined(localStorage['gpa_user'])) {
        return 'nothing in storage';
    }
    var terms = JSON.parse(localStorage['gpa_user']);
    if (!(term in terms)) {
        return 'no such term';
    }
    var courses = terms[term];
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