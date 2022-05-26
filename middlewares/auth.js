var Auth = {
    check_login: function (req, res, next)
    {
        if (!req.session.logged_in) {
            return res.redirect('/');
        }
        next();
    },
    is_status: function (req, res, next)
    {
        if (!req.session.status) {
            return res.redirect('/');
        }
        next();
    },
};


module.exports = Auth;