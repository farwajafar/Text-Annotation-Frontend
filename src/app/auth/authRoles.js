/**
 * Authorization Roles
 */
const authRoles = {
    admin    : ['admin'],
    annotator   : ['annotator'],
    staff    : ['admin', 'staff','annotator'],
    user     : ['admin', 'staff', 'user', 'annotator'],
     onlyGuest: []
};

export default authRoles;
