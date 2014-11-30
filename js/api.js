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

function edit_term(term, name) {
    if (_is_undefined(localStorage['gpa_user'])) { //new term
        localStorage['gpa_user'] = null;
    }

    var terms = JSON.parse(localStorage['gpa_user']);
    if (term in terms) {
        var contents = terms[term];
        delete terms[term];
        terms[name] = contents;
        localStorage['gpa_user'] = JSON.stringify(terms);
        return 'edited';
    }
    return 'no such term';
}

function delete_term(term) {
    if (_is_undefined(localStorage['gpa_user'])) {
        return 'nothing in storage';
    }

    var terms = JSON.parse(localStorage['gpa_user']);
    if ((terms == null) || !(term in terms)) {
        return 'no terms';
    }
    delete terms[term];

    var t_keys = Object.keys(terms);
    if (t_keys.length == 0) { // set to null so add_term(term) will work properly
        terms = null;
        localStorage['gpa_user'] = JSON.stringify(terms);
        return 'made null';
    }
    localStorage['gpa_user'] = JSON.stringify(terms);
    return 'deleted';
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
    details['distance'] = goal;
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

function delete_course(term, course) {
    if (_is_undefined(localStorage['gpa_user'])) {
        return 'nothing in storage';
    }

    var terms = JSON.parse(localStorage['gpa_user']);
    if (!(term in terms)) {
        return 'no such term';
    }

    var courses = terms[term];
    if ((courses == null) || !(course in courses)) {
        return 'no such course';
    }

    delete courses[course];
    var c_keys = Object.keys(courses);
    if (c_keys.length == 0) {
        courses = null;
        terms[term] = courses;
        localStorage['gpa_user'] = JSON.stringify(terms);
        return 'made null';
    }
    localStorage['gpa_user'] = JSON.stringify(terms);
    return 'course deleted';
}

function edit_course(term, course, name, goal) {
    if (_is_undefined(localStorage['gpa_user'])) {
        return 'nothing in storage';
    }

    var terms = JSON.parse(localStorage['gpa_user']);
    if (!(term in terms)) {
        return 'no such term';
    }

    var courses = terms[term];
    if (course in courses) {
        var contents = courses[course];
        delete courses[course];
        contents['goal'] = goal;
        var assessments = contents['details'];
        if (assessments != null) {
            contents['distance'] = _calc_distance(assessments, contents);
        } else {
            contents['distance'] = goal;
        }
        courses[name] = contents;
        terms[term] = courses;
        localStorage['gpa_user'] = JSON.stringify(terms);
        return 'edited';
    }
    return 'no such course';
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
    return Object.keys(assessments);
}

function delete_assessment(term, course, assessment) {
    if (_is_undefined(localStorage['gpa_user'])) {
        return 'nothing in storage';
    }

    var terms = JSON.parse(localStorage['gpa_user']);
    if (!(term in terms)) {
        return 'no such term';
    }

    var courses = terms[term];
    if ((courses == null) || !(course in courses)) {
        return 'no such course';
    }

    var course_info = courses[course];
    var assessments = course_info['details'];
    if ((assessments == null) || !(assessment in assessments)) {
        return 'no such assessment';
    }

    delete assessments[assessment];
    var a_keys = Object.keys(assessments);
    if (a_keys.length == 0) {
        assessments = null;
        course_info['details'] = assessments;
        course_info['distance'] = course_info['goal'];
        courses[course] = course_info;
        terms[term] = courses;
        localStorage['gpa_user'] = JSON.stringify(terms);
        return 'made null';
    }
    course_info['details'] = assessments;
    courses[course] = course_info;
    course_info['distance'] = _calc_distance(assessments, course_info);
    terms[term] = courses;
    localStorage['gpa_user'] = JSON.stringify(terms);
    return 'deleted';
}

function add_mark(term, course, assessment, mark) {
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
        var new_as = [];
        new_as.push(mark);
        list = new_as;
        as_details['list'] = list;
        as_details['overall'] = mark; // update overall mark
        assessments[assessment] = as_details;
        course_info['details'] = assessments;
        course_info['distance'] = _calc_distance(assessments, course_info);
        courses[course] = course_info;
        terms[term] = courses;
        localStorage['gpa_user'] = JSON.stringify(terms);
        return 'success';
    }

    list.push(mark);
    as_details['list'] = list;
    as_details['overall'] = _update_overall(list); // update over all mark;
    assessments[assessment] = as_details;
    course_info['details'] = assessments;
    course_info['distance'] = _calc_distance(assessments, course_info);
    courses[course] = course_info;
    terms[term] = courses;
    localStorage['gpa_user'] = JSON.stringify(terms);
    return 'success';
}

function delete_mark(term, course, assessment, index) {
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
    if (list == null || !(name in list)) {
        return 'no such assessment name';
    }

    list.splice(index, 1);
    if (list.length == 0) {
        list = null;
        as_details['list'] = list;
        as_details['overall'] = 0; // update over all mark;
        assessments[assessment] = as_details;
        course_info['details'] = assessments;
        course_info['distance'] = _calc_distance(assessments, course_info);
        courses[course] = course_info;
        terms[term] = courses;
        localStorage['gpa_user'] = JSON.stringify(terms);
        return 'made null';
    }
    as_details['list'] = list;
    as_details['overall'] = _update_overall(list); // update over all mark;
    assessments[assessment] = as_details;
    course_info['details'] = assessments;
    course_info['distance'] = _calc_distance(assessments, course_info);
    courses[course] = course_info;
    terms[term] = courses;
    localStorage['gpa_user'] = JSON.stringify(terms);
    return 'deleted';
}

function edit_weight(term, course, assessment, weight) {
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

    var contents = assessments[assessment];
    contents['weight'] = weight;
    assessments[assessment] = contents;
    course_info['distance'] = _calc_distance(assessments, course_info);
    courses[course] = course_info;
    terms[term] = courses;
    localStorage['gpa_user'] = JSON.stringify(terms);
    return 'edited';
}

function edit_mark(term, course, assessment, index, mark) {
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
    if (as_details['list'] == null) {
        return 'nothing to edit';
    }

    var contents = as_details['list'];
    contents[index] = mark;
    as_details['list'] = contents;
    as_details['overall'] = _update_overall(contents); // update over all mark;
    assessments[assessment] = as_details;
    course_info['details'] = assessments;
    course_info['distance'] = _calc_distance(assessments, course_info);
    courses[course] = course_info;
    terms[term] = courses;
    localStorage['gpa_user'] = JSON.stringify(terms);
    return 'edited';
}

function get_marks(term, course, assessment) {
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
    if (as_details['list'] == null) {
        return 'nothing to get';
    }

    return as_details['list'];
}

function _update_overall(list) {
    var total = 0;
    for (var i = 0; i < list.length; i++) {
        total += parseFloat(list[i]);
    }
    return total / list.length;
}

function _calc_distance(assessments, course_info) {
    var as_names = Object.keys(assessments);
    var pct = 0;
    console.log('as names', as_names);
    for (var i = 0; i < as_names.length; i++) {
        var as_marks = assessments[as_names[i]];
        console.log('weight', as_marks['weight'], 'overall', as_marks['overall']);
        var pct_weight = parseFloat(as_marks['weight']) / 100;
        pct = pct + pct_weight * parseFloat(as_marks['overall']);
    }
    return parseFloat(course_info['goal']) - pct;
}