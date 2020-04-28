const express = require('express');
const router = express.Router();

// --------------------------------------------------
// Start
// --------------------------------------------------

router.get('/', (req, res) => {
  delete req.session.data;

  res.render('index', {
    actions: {
      start: req.baseUrl + '/medical-equipment'
    }
  });
});

// --------------------------------------------------
// Q: Can you offer medical equipment?
// --------------------------------------------------
router.get('/medical-equipment', (req, res) => {

  let next = req.baseUrl + '/medical-equipment';
  if (req.headers.referer.includes('check-your-answers')) {
    next = next + '?referer=check-your-answers';
  }

  if (req.session.data.answers === undefined) {
    req.session.data.answers = {};
  }

  res.render('medical-equipment', {
    actions: {
      save: next,
      back: req.baseUrl + '/',
      start: req.baseUrl + '/'
    }
  });
});

router.post('/medical-equipment', (req, res) => {

  let next = req.baseUrl + '/medical-equipment';
  if (req.query.referer == 'check-your-answers') {
    next = next + '?referer=check-your-answers';
  }

  let errors = [];

  if (req.session.data.answers['medical-equipment'] === undefined) {
    let error = {};
    error.fieldName = 'medical-equipment';
    error.href = '#medical-equipment';
    error.text = 'Choose whether you can offer medical equipment';
    errors.push(error);
  }

  if (errors.length) {

    res.render('medical-equipment', {
      errors: errors,
      actions: {
        save: next,
        back: req.baseUrl + '/',
        start: req.baseUrl + '/'
      }
    });

  } else {

    if (req.session.data.answers['medical-equipment'] == 'yes') {
      res.redirect(req.baseUrl + '/business-type');
    } else {
      res.redirect(req.baseUrl + '/accommodation');
    }

  }

});

// --------------------------------------------------
// Q: Can you offer accommodation?
// --------------------------------------------------
router.get('/accommodation', (req, res) => {

  let next = req.baseUrl + '/accommodation';
  if (req.headers.referer.includes('check-your-answers')) {
    next = next + '?referer=check-your-answers';
  }

  res.render('accommodation', {
    actions: {
      save: next,
      back: req.baseUrl + '/medical-equipment',
      start: req.baseUrl + '/'
    }
  });
});

router.post('/accommodation', (req, res) => {

  let next = req.baseUrl + '/accommodation';
  if (req.query.referer == 'check-your-answers') {
    next = next + '?referer=check-your-answers';
  }

  let errors = [];

  if (req.session.data.answers['accommodation'] === undefined) {
    let error = {};
    error.fieldName = 'accommodation';
    error.href = '#accommodation';
    error.text = 'Choose whether you can offer medical equipment';
    errors.push(error);
  }

  if (errors.length) {

    res.render('accommodation', {
      errors: errors,
      actions: {
        save: next,
        back: req.baseUrl + '/medical-equipment',
        start: req.baseUrl + '/'
      }
    });

  } else {

    if (req.session.data.answers['accommodation'].includes('yes')) {
      res.redirect(req.baseUrl + '/accommodation-quantity');
    } else {
      res.redirect(req.baseUrl + '/transport-logistics');
    }

  }

});

// --------------------------------------------------
// Q: How many rooms can you offer?
// --------------------------------------------------
router.get('/accommodation-quantity', (req, res) => {

  let next = req.baseUrl + '/accommodation-quantity';
  if (req.headers.referer.includes('check-your-answers')) {
    next = next + '?referer=check-your-answers';
  }

  res.render('accommodation-quantity', {
    actions: {
      save: next,
      back: req.baseUrl + '/accommodation',
      start: req.baseUrl + '/'
    }
  });
});

router.post('/accommodation-quantity', (req, res) => {

  let next = req.baseUrl + '/accommodation-quantity';
  if (req.query.referer == 'check-your-answers') {
    next = next + '?referer=check-your-answers';
  }

  let errors = [];

  if (!req.session.data.answers['accommodation-quantity'].length) {
    let error = {};
    error.fieldName = 'accommodation-quantity';
    error.href = '#accommodation-quantity';
    error.text = 'Enter how many hotel rooms you can offer';
    errors.push(error);
  }

  if (errors.length) {

    res.render('accommodation-quantity', {
      errors: errors,
      actions: {
        save: next,
        back: req.baseUrl + '/accommodation',
        start: req.baseUrl + '/'
      }
    });

  } else {

    res.redirect(req.baseUrl + '/transport-logistics');

  }

});

// --------------------------------------------------
// Q: Can you offer transport or logistics?
// --------------------------------------------------
router.get('/transport-logistics', (req, res) => {

  let next = req.baseUrl + '/transport-logistics';
  if (req.headers.referer.includes('check-your-answers')) {
    next = next + '?referer=check-your-answers';
  }

  let previous = req.baseUrl + '/accommodation';
  if (req.session.data.answers['accommodation'].includes('yes')) {
    previous = req.baseUrl + '/accommodation-quantity';
  }

  res.render('transport-logistics', {
    actions: {
      save: next,
      back: previous,
      start: req.baseUrl + '/'
    }
  });
});

router.post('/transport-logistics', (req, res) => {

  let next = req.baseUrl + '/transport-logistics';
  if (req.query.referer == 'check-your-answers') {
    next = next + '?referer=check-your-answers';
  }

  let previous = req.baseUrl + '/accommodation';
  if (req.session.data.answers['accommodation'].includes('yes')) {
    previous = req.baseUrl + '/accommodation-type';
  }

  let errors = [];

  if (req.session.data.answers['transport-logistics'] === undefined) {
    let error = {};
    error.fieldName = 'transport-logistics';
    error.href = '#transport-logistics';
    error.text = 'Choose whether you can offer transport or logistics';
    errors.push(error);
  }

  if (errors.length) {

    res.render('transport-logistics', {
      errors: errors,
      actions: {
        save: next,
        back: previous,
        start: req.baseUrl + '/'
      }
    });

  } else {

    if (req.session.data.answers['transport-logistics'] == 'yes') {
      res.redirect(req.baseUrl + '/transport-logistics-type');
    } else {
      res.redirect(req.baseUrl + '/space');
    }

  }

});

// --------------------------------------------------
// Q: What kind of transport or logistics can you offer?
// --------------------------------------------------
router.get('/transport-logistics-type', (req, res) => {

  let next = req.baseUrl + '/transport-logistics-type';
  if (req.headers.referer.includes('check-your-answers')) {
    next = next + '?referer=check-your-answers';
  }

  res.render('transport-logistics-type', {
    actions: {
      save: next,
      back: req.baseUrl + '/transport-logistics',
      start: req.baseUrl + '/'
    }
  });
});

router.post('/transport-logistics-type', (req, res) => {

  let next = req.baseUrl + '/transport-logistics-type';
  if (req.query.referer == 'check-your-answers') {
    next = next + '?referer=check-your-answers';
  }

  let errors = [];

  if (req.session.data.answers['transport-logistics-type'] === undefined) {
    let error = {};
    error.fieldName = 'transport-logistics-type';
    error.href = '#transport-logistics-type';
    error.text = 'Choose what kinds of transport or logisitics services you can offer';
    errors.push(error);
  }

  if (!req.session.data.answers['transport-logistics-type-description'].length) {
    let error = {};
    error.fieldName = 'transport-logistics-type-description';
    error.href = '#transport-logistics-type-description';
    error.text = 'Enter a description of the kind of transport or logistics services you can offer';
    errors.push(error);
  }

  if (errors.length) {

    res.render('transport-logistics-type', {
      errors: errors,
      actions: {
        save: next,
        back: req.baseUrl + '/transport-logistics',
        start: req.baseUrl + '/'
      }
    });

  } else {

    res.redirect(req.baseUrl + '/space');

  }

});

// --------------------------------------------------
// Q: Can you offer space?
// --------------------------------------------------
router.get('/space', (req, res) => {

  let next = req.baseUrl + '/space';
  if (req.headers.referer.includes('check-your-answers')) {
    next = next + '?referer=check-your-answers';
  }

  let previous = req.baseUrl + '/transport-logistics';
  if (req.session.data.answers['transport-logistics'] == 'yes') {
    previous = req.baseUrl + '/transport-logistics-type';
  }

  res.render('space', {
    actions: {
      save: next,
      back: previous,
      start: req.baseUrl + '/'
    }
  });
});

router.post('/space', (req, res) => {

  let next = req.baseUrl + '/space';
  if (req.query.referer == 'check-your-answers') {
    next = next + '?referer=check-your-answers';
  }

  let previous = req.baseUrl + '/transport-logistics';
  if (req.session.data.answers['transport-logistics'] == 'yes') {
    previous = req.baseUrl + '/transport-logistics-type';
  }

  let errors = [];

  if (req.session.data.answers['space'] === undefined) {
    let error = {};
    error.fieldName = 'space';
    error.href = '#space';
    error.text = 'Choose whether you can offer space';
    errors.push(error);
  }

  if (errors.length) {

    res.render('space', {
      errors: errors,
      actions: {
        save: next,
        back: previous,
        start: req.baseUrl + '/'
      }
    });

  } else {

    if (req.session.data.answers['space'] == 'yes') {
      res.redirect(req.baseUrl + '/space-type');
    } else {
      res.redirect(req.baseUrl + '/care');
    }

  }

});

// --------------------------------------------------
// Q: What kind of space can you offer?
// --------------------------------------------------
router.get('/space-type', (req, res) => {

  let next = req.baseUrl + '/space-type';
  if (req.headers.referer.includes('check-your-answers')) {
    next = next + '?referer=check-your-answers';
  }

  res.render('space-type', {
    actions: {
      save: next,
      back: req.baseUrl + '/space',
      start: req.baseUrl + '/'
    }
  });
});

router.post('/space-type', (req, res) => {

  let next = req.baseUrl + '/space-type';
  if (req.query.referer == 'check-your-answers') {
    next = next + '?referer=check-your-answers';
  }

  let errors = [];

  if (req.session.data.answers['space-type'] === undefined) {
    let error = {};
    error.fieldName = 'space-type';
    error.href = '#space-type';
    error.text = 'Choose what kind of space you can offer';
    errors.push(error);
  } else {

    if (req.session.data.answers['space-type'].indexOf('warehouse') !== -1 && !req.session.data.answers['space-type-warehouse-quantity'].length) {
      let error = {};
      error.fieldName = 'space-type-warehouse-quantity';
      error.href = '#space-type-warehouse-quantity';
      error.text = 'Enter the approximate total size of warehouse space';
      errors.push(error);
    }

    if (req.session.data.answers['space-type'].indexOf('office') !== -1 && !req.session.data.answers['space-type-office-quantity'].length) {
      let error = {};
      error.fieldName = 'space-type-office-quantity';
      error.href = '#space-type-office-quantity';
      error.text = 'Enter the approximate total size of office space';
      errors.push(error);
    }

    if (req.session.data.answers['space-type'].indexOf('other') !== -1 && !req.session.data.answers['space-type-other-quantity'].length) {
      let error = {};
      error.fieldName = 'space-type-other-quantity';
      error.href = '#space-type-other-quantity';
      error.text = 'Enter the approximate total size of all other spaces';
      errors.push(error);
    }

  }

  if (!req.session.data.answers['space-type-description'].length) {
    let error = {};
    error.fieldName = 'space-type-description';
    error.href = '#space-type-description';
    error.text = 'Enter a description of the kind of space you can offer';
    errors.push(error);
  }

  if (errors.length) {

    res.render('space-type', {
      errors: errors,
      actions: {
        save: next,
        back: req.baseUrl + '/space',
        start: req.baseUrl + '/'
      }
    });

  } else {

    res.redirect(req.baseUrl + '/care');

  }

});

// --------------------------------------------------
// Q: Can you offer social care or childcare?
// --------------------------------------------------
router.get('/care', (req, res) => {

  let next = req.baseUrl + '/care';
  if (req.headers.referer.includes('check-your-answers')) {
    next = next + '?referer=check-your-answers';
  }

  let previous = req.baseUrl + '/space';
  if (req.session.data.answers['space'] == 'yes') {
    previous = req.baseUrl + '/space-type';
  }

  res.render('care', {
    actions: {
      save: next,
      back: previous,
      start: req.baseUrl + '/'
    }
  });
});

router.post('/care', (req, res) => {

  let next = req.baseUrl + '/care';
  if (req.query.referer == 'check-your-answers') {
    next = next + '?referer=check-your-answers';
  }

  let previous = req.baseUrl + '/space';
  if (req.session.data.answers['space'] == 'yes') {
    previous = req.baseUrl + '/space-type';
  }

  let errors = [];

  if (req.session.data.answers['care'] === undefined) {
    let error = {};
    error.fieldName = 'care';
    error.href = '#care';
    error.text = 'Choose whether you can offer social care or childcare';
    errors.push(error);
  }

  if (errors.length) {

    res.render('care', {
      errors: errors,
      actions: {
        save: next,
        back: previous,
        start: req.baseUrl + '/'
      }
    });

  } else {

    if (req.session.data.answers['care'] == 'yes') {
      res.redirect(req.baseUrl + '/care-type');
    } else {
      res.redirect(req.baseUrl + '/expertise');
    }

  }

});

// --------------------------------------------------
// Q: What kind of care can you offer?
// --------------------------------------------------
router.get('/care-type', (req, res) => {

  let next = req.baseUrl + '/care-type';
  if (req.headers.referer.includes('check-your-answers')) {
    next = next + '?referer=check-your-answers';
  }

  res.render('care-type', {
    actions: {
      save: next,
      back: req.baseUrl + '/care',
      start: req.baseUrl + '/'
    }
  });
});

router.post('/care-type', (req, res) => {

  let next = req.baseUrl + '/care-type';
  if (req.query.referer == 'check-your-answers') {
    next = next + '?referer=check-your-answers';
  }

  let errors = [];

  if (req.session.data.answers['care-type'] === undefined) {
    let error = {};
    error.fieldName = 'care-type';
    error.href = '#care-type';
    error.text = 'Choose what kind of care you can offer';
    errors.push(error);
  }

  if (req.session.data.answers['care-qualifications'] === undefined) {
    let error = {};
    error.fieldName = 'care-qualifications';
    error.href = '#care-qualifications';
    error.text = 'Choose what qualifications your or people in your business have';
    errors.push(error);
  } else {
    if (req.session.data.answers['care-qualifications'].indexOf('healthcare') !== -1 && !req.session.data.answers['care-qualifications-healthcare-description'].length) {
      let error = {};
      error.fieldName = 'care-qualifications-healthcare-description';
      error.href = '#care-qualifications-healthcare-description';
      error.text = 'Enter a description of the kind of healthcare qualifications';
      errors.push(error);
    }
  }

  if (errors.length) {

    res.render('care-type', {
      errors: errors,
      actions: {
        save: req.baseUrl + '/care-type',
        back: req.baseUrl + '/care',
        start: req.baseUrl + '/'
      }
    });

  } else {

    res.redirect(req.baseUrl + '/expertise');

  }

});

// --------------------------------------------------
// Q: What kind of expertise can you offer?
// --------------------------------------------------
router.get('/expertise', (req, res) => {

  let next = req.baseUrl + '/expertise';
  if (req.headers.referer.includes('check-your-answers')) {
    next = next + '?referer=check-your-answers';
  }

  let previous = req.baseUrl + '/care';
  if (req.session.data.answers['care'] == 'yes') {
    previous = req.baseUrl + '/care-type';
  }

  res.render('expertise', {
    actions: {
      save: next,
      back: previous,
      start: req.baseUrl + '/'
    }
  });
});

router.post('/expertise', (req, res) => {

  let next = req.baseUrl + '/expertise';
  if (req.query.referer == 'check-your-answers') {
    next = next + '?referer=check-your-answers';
  }

  let previous = req.baseUrl + '/care';
  if (req.session.data.answers['care'] == 'yes') {
    previous = req.baseUrl + '/care-type';
  }

  let errors = [];

  if (!req.session.data.answers['expertise'].length) {
    let error = {};
    error.fieldName = 'expertise';
    error.href = '#expertise';
    error.text = 'Choose what kinds of expertise you can offer';
    errors.push(error);
  }

  if (req.session.data.answers['expertise'] == 'other' && !req.session.data.answers['expertise-other'].length) {
    let error = {};
    error.fieldName = 'expertise-other';
    error.href = '#expertise-other';
    error.text = 'Enter other type of expertise';
    errors.push(error);
  }

  if (errors.length) {

    res.render('expertise', {
      errors: errors,
      actions: {
        save: next,
        back: previous,
        start: req.baseUrl + '/'
      }
    });

  } else {

    if (req.session.data.answers['expertise'] == 'yes') {
      res.redirect(req.baseUrl + '/kind-of-expertise');
    } else {
      res.redirect(req.baseUrl + '/other-support');
    }

  }

});

// --------------------------------------------------
// Q: Can you offer any other kind of support?
// --------------------------------------------------
router.get('/other-support', (req, res) => {

  let next = req.baseUrl + '/other-support';
  if (req.headers.referer.includes('check-your-answers')) {
    next = next + '?referer=check-your-answers';
  }

  res.render('other-support', {
    actions: {
      save: next,
      back: req.baseUrl + '/expertise',
      start: req.baseUrl + '/'
    }
  });
});

router.post('/other-support', (req, res) => {

  let next = req.baseUrl + '/other-support';
  if (req.query.referer == 'check-your-answers') {
    next = next + '?referer=check-your-answers';
  }

  let errors = [];

  // if (!req.session.data.answers['other-support'].length) {
  //   let error = {};
  //   error.fieldName = 'other-support';
  //   error.href = '#other-support';
  //   error.text = 'Enter a description of other kinds of support';
  //   errors.push(error);
  // }

  if (errors.length) {

    res.render('other-support', {
      errors: errors,
      actions: {
        save: next,
        back: req.baseUrl + '/expertise',
        start: req.baseUrl + '/'
      }
    });

  } else {

    res.redirect(req.baseUrl + '/location');

  }

});

// --------------------------------------------------
// Q: Where can you offer your services?
// --------------------------------------------------
router.get('/location', (req, res) => {

  let next = req.baseUrl + '/location';
  if (req.headers.referer.includes('check-your-answers')) {
    next = next + '?referer=check-your-answers';
  }

  res.render('location', {
    actions: {
      save: next,
      back: req.baseUrl + '/other-support',
      start: req.baseUrl + '/'
    }
  });
});

router.post('/location', (req, res) => {

  let next = req.baseUrl + '/location';
  if (req.query.referer == 'check-your-answers') {
    next = next + '?referer=check-your-answers';
  }

  let errors = [];

  if (req.session.data.answers['location'] === undefined) {
    let error = {};
    error.fieldName = 'location';
    error.href = '#location';
    error.text = 'Choose where you can offer your services';
    errors.push(error);
  }

  if (errors.length) {

    res.render('location', {
      errors: errors,
      actions: {
        save: next,
        back: req.baseUrl + '/other-support',
        start: req.baseUrl + '/'
      }
    });

  } else {

    res.redirect(req.baseUrl + '/business-details');

  }

});

// --------------------------------------------------
// Your business details
// --------------------------------------------------
router.get('/business-details', (req, res) => {

  let next = req.baseUrl + '/business-details';
  if (req.headers.referer.includes('check-your-answers')) {
    next = next + '?referer=check-your-answers';
  }

  res.render('business-details', {
    actions: {
      save: next,
      back: req.baseUrl + '/location',
      start: req.baseUrl + '/'
    }
  });
});

router.post('/business-details', (req, res) => {

  let next = req.baseUrl + '/business-details';
  if (req.query.referer == 'check-your-answers') {
    next = next + '?referer=check-your-answers';
  }

  let errors = [];

  if (!req.session.data.answers['company-name'].length) {
    let error = {};
    error.fieldName = 'company-name';
    error.href = '#company-name';
    error.text = 'Enter a company name';
    errors.push(error);
  }

  if (!req.session.data.answers['company-number'].length) {
    let error = {};
    error.fieldName = 'company-number';
    error.href = '#company-number';
    error.text = 'Enter a company number';
    errors.push(error);
  }

  if (req.session.data.answers['company-size'] === undefined) {
    let error = {};
    error.fieldName = 'company-size';
    error.href = '#company-size';
    error.text = 'Choose a company size';
    errors.push(error);
  }

  if (req.session.data.answers['company-location'] === undefined) {
    let error = {};
    error.fieldName = 'company-location';
    error.href = '#company-location';
    error.text = 'Choose the location of the company’s main office';
    errors.push(error);
  } else {
    if (req.session.data.answers['company-location'] == 'uk' && !req.session.data.answers['company-postcode'].length) {
      let error = {};
      error.fieldName = 'company-postcode';
      error.href = '#company-postcode';
      error.text = 'Enter a postcode';
      errors.push(error);
    }
  }

  if (errors.length) {

    res.render('business-details', {
      errors: errors,
      actions: {
        save: next,
        back: req.baseUrl + '/location',
        start: req.baseUrl + '/'
      }
    });

  } else {

    res.redirect(req.baseUrl + '/contact-details');

  }

});

// --------------------------------------------------
// Your contact details
// --------------------------------------------------
router.get('/contact-details', (req, res) => {

  let next = req.baseUrl + '/contact-details';
  if (req.headers.referer.includes('check-your-answers')) {
    next = next + '?referer=check-your-answers';
  }

  let previous = req.baseUrl + '/business-details';
  // if (req.headers.referer.includes('check-your-answers')) {
  //   previous = req.baseUrl + '/check-your-answers';
  // }

  res.render('contact-details', {
    actions: {
      save: next,
      back: previous,
      start: req.baseUrl + '/'
    }
  });
});

router.post('/contact-details', (req, res) => {

  let next = req.baseUrl + '/contact-details';
  if (req.query.referer == 'check-your-answers') {
    next = next + '?referer=check-your-answers';
  }

  let errors = [];

  if (!req.session.data.answers['contact-name'].length) {
    let error = {};
    error.fieldName = 'contact-name';
    error.href = '#contact-name';
    error.text = 'Enter name of main contact';
    errors.push(error);
  }

  // if (!req.session.data.answers['contact-role'].length) {
  //   let error = {};
  //   error.fieldName = 'contact-role';
  //   error.href = '#contact-role';
  //   error.text = 'Enter role of main contact';
  //   errors.push(error);
  // }

  if (!req.session.data.answers['contact-phone'].length) {
    let error = {};
    error.fieldName = 'contact-phone';
    error.href = '#contact-phone';
    error.text = 'Enter phone number of main contact';
    errors.push(error);
  }

  if (!req.session.data.answers['contact-email'].length) {
    let error = {};
    error.fieldName = 'contact-email';
    error.href = '#contact-email';
    error.text = 'Enter email of main contact';
    errors.push(error);
  }

  if (errors.length) {

    res.render('contact-details', {
      errors: errors,
      actions: {
        save: next,
        back: req.baseUrl + '/business-details',
        start: req.baseUrl + '/'
      }
    });

  } else {

    res.redirect(req.baseUrl + '/check-your-answers');

  }

});

// --------------------------------------------------
// Check your answers
// --------------------------------------------------
router.get('/check-your-answers', (req, res) => {

  res.render('check-your-answers', {
    actions: {
      next: req.baseUrl + '/confirmation',
      back: req.baseUrl + '/contact-details',
      start: req.baseUrl + '/'
    }
  });

});

// --------------------------------------------------
// Check your answers
// --------------------------------------------------
router.get('/confirmation', (req, res) => {

  res.render('confirmation', {
    actions: {
      start: req.baseUrl + '/'
    }
  });

});

// --------------------------------------------------
// Add routes above this line
// --------------------------------------------------
module.exports = router
