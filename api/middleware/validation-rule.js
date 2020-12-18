

const {check} = require('express-validator') 
//const repo = require('./repository') 
module.exports = { 
	
validateConfirmPassword : check('confirmPassword') 

	// To delete leading and triling space 
	.trim() 

	// Validate minimum length of password 
	// Optional for this context 
	.isLength({min:4, max:16}) 

	// Custom message 
	.withMessage('Password must be between 4 to 16 characters') 

	// Custom validation 
	// Validate confirmPassword 
	.custom(async (confirmPassword, {req}) => { 
	const password = req.body.password 

	// If password and confirm password not same 
	// don't allow to sign up and throw error 
	if(password !== confirmPassword){ 
		throw new Error('Passwords must be same') 
	} 
	}), 
};










//const { check,sanitizeBody } = require('express-validator');

//module.exports = (req, res, next)=>{
  // first Name validation
//  check('name').trim().notEmpty().withMessage('Name required')
//  .matches(/^[a-zA-Z ]*$/).withMessage('Only Characters with white space are allowed'),
 
  // email address validation
//  check('emailAddress').notEmpty().withMessage('Email Address required').normalizeEmail().isEmail().withMessage('must be a valid email'),
  // password validation
//  check('password').trim().notEmpty().withMessage('Password required')
//  .isLength({ min: 5 }).withMessage('password must be minimum 5 length')
//  .matches(/(?=.*?[A-Z])/).withMessage('At least one Uppercase')
 // .matches(/(?=.*?[a-z])/).withMessage('At least one Lowercase')
 // .matches(/(?=.*?[0-9])/).withMessage('At least one Number')
 // .matches(/(?=.*?[#?!@$%^&*-])/).withMessage('At least one special character')
//  .not().matches(/^$|\s+/).withMessage('White space not allowed'),
  // confirm password validation 
//  check('confirmPassword').custom((value, { req }) => {
//       if (value !== req.body.password) {
//             throw new Error('Password Confirmation does not match password');
//        }
//        return true;
//   })
//};