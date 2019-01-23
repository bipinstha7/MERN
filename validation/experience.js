const Validator = require('validator')
const isEmpty = require('./is_empty')

const validateExperienceInput = data => {
    let errors = {}

    let { title, company, from } = data
    
    title = !isEmpty(title) ? title : ''
    company = !isEmpty(company) ? company : ''
    from = !isEmpty(from) ? from : ''

    if (Validator.isEmpty(title)) {
        errors.title = 'Job title field is required'
    }

    if (Validator.isEmpty(company)) {
        errors.company = 'Company field is required'
    }

    if (Validator.isEmpty(from)) {
        errors.from = 'From date field is required'
    }

	return {
		errors, 
		isValid: isEmpty(errors),
	}
}

module.exports = validateExperienceInput
