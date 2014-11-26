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
    if (_is_undefined(localStorage['gpa_user'])) {
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

    if (name in courses) {
        return 'name exists';
    }

    courses[name] = details;
    terms[term] = courses;
    localStorage['gpa_user'] = JSON.stringify(terms);
    return 'success';
}

function get_courses(term) {
    if (_is_undefined(localStorage['gpa_user'])) {
        return 'nothing in storage';
    }
    var terms = JSON.parse(localStorage['gpa_user']);
    if (!(term in terms)) {
        return 'no such term';
    }
    var courses = terms[term];
    return Object.keys(courses);
}

function add_assessment(term, course, name, weight) {
    if (_is_undefined(localStorage['gpa_user'])) {
        return 'nothing in storage';
    }

    var terms = JSON.parse(localStorage['gpa_user']);
    if (!(term in terms)) {
        return 'no such term';
    }

    var courses = terms[term];
    if (!(course in courses)) {
        return 'no such course';
    }

    var course_info = courses[course]; //{'goal': 0, 'distance': 0, 'details':null or Object}
    var assessments = course_info['details']; //{null or 'quizzes': Object}

    var as_details = {};
    as_details['weight'] = weight;
    as_details['overall'] = 0;
    as_details['list'] = null;
    if (assessments == null) { // first assessment category
        var replace_null = {};
        replace_null[name] = as_details;
        course_info['details'] = replace_null;
        courses[course] = course_info;
        terms[term] = courses;
        localStorage['gpa_user'] = JSON.stringify(terms);
        return 'success';
    }

    assessments[name] = as_details;
    course_info['details'] = assessments;
    courses[course] = course_info;
    terms[term] = courses;
    localStorage['gpa_user'] = JSON.stringify(terms);
    return 'success';
}

function get_assessments(term, course) {
    if (_is_undefined(localStorage['gpa_user'])) {
        return 'nothing in storage';
    }

    var terms = JSON.parse(localStorage['gpa_user']);
    if (!(term in terms)) {
        return 'no such term';
    }

    var courses = terms[term];
    if (!(course in courses)) {
        return 'no such course';
    }

    var course_info = courses[course];
    var assessments = course_info['details'];
    return JSON.stringify(Object.keys(assessments));
}

function add_mark(term, course, assessment, name, mark) {
    console.log('called');
    if (_is_undefined(localStorage['gpa_user'])) {
        return 'nothing in storage';
    }

    var terms = JSON.parse(localStorage['gpa_user']);
    if (!(term in terms)) {
        return 'no such term';
    }

    var courses = terms[term];
    if (!(course in courses)) {
        return 'no such course';
    }

    var course_info = courses[course]; //{'goal': 0, 'distance': 0, 'details':null or Object}
    var assessments = course_info['details']; //{null or 'quizzes': Object}

    if (assessments == null || !(assessment in assessments)) {
        return 'no such assessment';
    }

    var as_details = assessments[assessment];
    var list = as_details['list'];
    if (list == null) { // first mark
        var new_as = {};
        new_as[name] = mark;
        list = new_as;
        as_details['list'] = list;
        as_details['overall'] = mark; // update overall mark
        assessments[assessment] = as_details;
        course_info['details'] = assessments;
        courses[course] = course_info;
        terms[term] = courses;
        localStorage['gpa_user'] = JSON.stringify(terms);
        return 'success';
    }

    list[name] = mark;
    as_details['list'] = list;
    var average = _update_overall(list); // update over all mark
    as_details['overall'] = average;
    assessments[assessment] = as_details;
    course_info['details'] = assessments;
    courses[course] = course_info;
    terms[term] = courses;
    localStorage['gpa_user'] = JSON.stringify(terms);
    return 'success';
}

function _update_overall(list) {
    var keys = Object.keys(list);
    var total = 0;
    for(var i=0; i<keys.length; i++) {
        total += parseInt(list[keys[i]]);
    }
    return total / keys.length;
}