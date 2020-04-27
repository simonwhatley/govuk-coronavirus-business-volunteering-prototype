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

  if (req.session.data.answers === undefined) {
    req.session.data.answers = {};
  }

  res.render('medical-equipment', {
    actions: {
      save: req.baseUrl + '/medical-equipment',
      back: req.baseUrl + '/',
      start: req.baseUrl + '/'
    }
  });
});

router.post('/medical-equipment', (req, res) => {

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
        save: req.baseUrl + '/medical-equipment',
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

  res.render('accommodation', {
    actions: {
      save: req.baseUrl + '/accommodation',
      back: req.baseUrl + '/medical-equipment',
      start: req.baseUrl + '/'
    }
  });
});

router.post('/accommodation', (req, res) => {

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
        save: req.baseUrl + '/accommodation',
        back: req.baseUrl + '/medical-equipment',
        start: req.baseUrl + '/'
      }
    });

  } else {

    if (req.session.data.answers['accommodation'] == 'yes') {
      res.redirect(req.baseUrl + '/accommodation-quantity');
    } else {
      res.redirect(req.baseUrl + '/transport-logistics');
    }

  }

});

// --------------------------------------------------
// Q: Can you offer transport or logistics?
// --------------------------------------------------
router.get('/transport-logistics', (req, res) => {

  res.render('transport-logistics', {
    actions: {
      save: req.baseUrl + '/transport-logistics',
      back: req.baseUrl + '/accommodation',
      start: req.baseUrl + '/'
    }
  });
});

router.post('/transport-logistics', (req, res) => {

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
        save: req.baseUrl + '/transport-logistics',
        back: req.baseUrl + '/accommodation',
        start: req.baseUrl + '/'
      }
    });

  } else {

    if (req.session.data.answers['transport-logistics'] == 'yes') {
      res.redirect(req.baseUrl + '/kind-of-transport-logistics');
    } else {
      res.redirect(req.baseUrl + '/space');
    }

  }

});

// --------------------------------------------------
// Q: Can you offer space?
// --------------------------------------------------
router.get('/space', (req, res) => {

  res.render('space', {
    actions: {
      save: req.baseUrl + '/space',
      back: req.baseUrl + '/transport-logistics',
      start: req.baseUrl + '/'
    }
  });
});

router.post('/space', (req, res) => {

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
        save: req.baseUrl + '/space',
        back: req.baseUrl + '/transport-logistics',
        start: req.baseUrl + '/'
      }
    });

  } else {

    if (req.session.data.answers['space'] == 'yes') {
      res.redirect(req.baseUrl + '/kind-of-space');
    } else {
      res.redirect(req.baseUrl + '/adult-child-care');
    }

  }

});

// --------------------------------------------------
// Q: Can you offer social care or childcare?
// --------------------------------------------------
router.get('/adult-child-care', (req, res) => {

  res.render('adult-child-care', {
    actions: {
      save: req.baseUrl + '/adult-child-care',
      back: req.baseUrl + '/space',
      start: req.baseUrl + '/'
    }
  });
});

router.post('/adult-child-care', (req, res) => {

  let errors = [];

  if (req.session.data.answers['adult-child-care'] === undefined) {
    let error = {};
    error.fieldName = 'adult-child-care';
    error.href = '#adult-child-care';
    error.text = 'Choose whether you can offer social care or childcare';
    errors.push(error);
  }

  if (errors.length) {

    res.render('adult-child-care', {
      errors: errors,
      actions: {
        save: req.baseUrl + '/adult-child-care',
        back: req.baseUrl + '/space',
        start: req.baseUrl + '/'
      }
    });

  } else {

    if (req.session.data.answers['adult-child-care'] == 'yes') {
      res.redirect(req.baseUrl + '/kind-of-adult-child-care');
    } else {
      res.redirect(req.baseUrl + '/expertise');
    }

  }

});

// --------------------------------------------------
// Q: What kind of expertise can you offer?
// --------------------------------------------------
router.get('/expertise', (req, res) => {

  res.render('expertise', {
    actions: {
      save: req.baseUrl + '/expertise',
      back: req.baseUrl + '/adult-child-care',
      start: req.baseUrl + '/'
    }
  });
});

router.post('/expertise', (req, res) => {

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
        save: req.baseUrl + '/expertise',
        back: req.baseUrl + '/adult-child-care',
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

  res.render('other-support', {
    actions: {
      save: req.baseUrl + '/other-support',
      back: req.baseUrl + '/expertise',
      start: req.baseUrl + '/'
    }
  });
});

router.post('/other-support', (req, res) => {

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
        save: req.baseUrl + '/other-support',
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

  res.render('location', {
    actions: {
      save: req.baseUrl + '/location',
      back: req.baseUrl + '/other-support',
      start: req.baseUrl + '/'
    }
  });
});

router.post('/location', (req, res) => {

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
        save: req.baseUrl + '/location',
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

  res.render('business-details', {
    actions: {
      save: req.baseUrl + '/business-details',
      back: req.baseUrl + '/location',
      start: req.baseUrl + '/'
    }
  });
});

router.post('/business-details', (req, res) => {

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
        save: req.baseUrl + '/business-details',
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

  res.render('contact-details', {
    actions: {
      save: req.baseUrl + '/contact-details',
      back: req.baseUrl + '/business-details',
      start: req.baseUrl + '/'
    }
  });
});

router.post('/contact-details', (req, res) => {

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
        save: req.baseUrl + '/contact-details',
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
