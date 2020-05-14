const express = require('express');
const router = express.Router();

const uuid = require('uuid/v1');

function checkHasAnswers(req, res, next) {
  if (req.session.data.answers === undefined) {
    res.redirect(req.baseUrl + '/');
  } else {
    next();
  }
}

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

  let previous = req.baseUrl + '/';
  if (req.headers.referer.includes('check-your-answers')) {
    previous = previous + 'check-your-answers';
  }

  if (req.session.data.answers === undefined) {
    req.session.data.answers = {};
  }

  res.render('medical-equipment', {
    actions: {
      save: next,
      back: previous,
      start: req.baseUrl + '/'
    }
  });
});

router.post('/medical-equipment', checkHasAnswers, (req, res) => {

  let next = req.baseUrl + '/medical-equipment';
  if (req.query.referer == 'check-your-answers') {
    next = next + '?referer=check-your-answers';
  }

  let errors = [];

  if (req.session.data.answers['offer-medical-equipment'] === undefined) {
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

    if (req.session.data.answers['offer-medical-equipment'] == 'yes') {

      if (req.query.referer == 'check-your-answers') {
        res.redirect(req.baseUrl + '/check-your-answers');
      } else {
        res.redirect(req.baseUrl + '/business-type');
      }

    } else {

      if (req.query.referer == 'check-your-answers') {
        res.redirect(req.baseUrl + '/check-your-answers');
      } else {
        res.redirect(req.baseUrl + '/accommodation');
      }

    }

  }

});

// ----------------------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------

// --------------------------------------------------
// Q: Can you offer accommodation?
// --------------------------------------------------
router.get('/accommodation', checkHasAnswers, (req, res) => {

  let next = req.baseUrl + '/accommodation';
  if (req.headers.referer.includes('check-your-answers')) {
    next = next + '?referer=check-your-answers';
  }

  let previous = req.baseUrl + '/medical-equipment';
  if (req.headers.referer.includes('check-your-answers')) {
    previous = req.baseUrl + '/check-your-answers';
  }

  res.render('accommodation', {
    actions: {
      save: next,
      back: previous,
      start: req.baseUrl + '/'
    }
  });
});

router.post('/accommodation', checkHasAnswers, (req, res) => {

  let next = req.baseUrl + '/accommodation';
  if (req.query.referer == 'check-your-answers') {
    next = next + '?referer=check-your-answers';
  }

  let errors = [];

  if (req.session.data.answers['offer-accommodation'] === undefined) {
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

    if (req.session.data.answers['offer-accommodation'].includes('yes')) {

      if (req.query.referer == 'check-your-answers') {
        res.redirect(req.baseUrl + '/accommodation-details?referer=check-your-answers');
      } else {
        res.redirect(req.baseUrl + '/accommodation-details');
      }

    } else {

      delete req.session.data.answers['accommodation'];

      if (req.query.referer == 'check-your-answers') {
        res.redirect(req.baseUrl + '/check-your-answers');
      } else {
        res.redirect(req.baseUrl + '/transport');
      }

    }

  }

});

// --------------------------------------------------
// Q: How many rooms can you offer?
// --------------------------------------------------
router.get('/accommodation-details', checkHasAnswers, (req, res) => {

  let next = req.baseUrl + '/accommodation-details';
  if (req.headers.referer.includes('check-your-answers') || req.query.referer == 'check-your-answers') {
    next = next + '?referer=check-your-answers';
  }

  res.render('accommodation-details', {
    actions: {
      save: next,
      back: req.baseUrl + '/accommodation',
      start: req.baseUrl + '/'
    }
  });
});

router.post('/accommodation-details', checkHasAnswers, (req, res) => {

  let next = req.baseUrl + '/accommodation-details';
  if (req.query.referer == 'check-your-answers') {
    next = next + '?referer=check-your-answers';
  }

  let errors = [];

  if (!req.session.data.answers['accommodation']['quantity'].length) {
    let error = {};
    error.fieldName = 'accommodation-quantity';
    error.href = '#accommodation-quantity';
    error.text = 'Enter how many hotel rooms you can offer';
    errors.push(error);
  }

  if (errors.length) {

    res.render('accommodation-details', {
      errors: errors,
      actions: {
        save: next,
        back: req.baseUrl + '/accommodation',
        start: req.baseUrl + '/'
      }
    });

  } else {

    if (req.query.referer == 'check-your-answers') {
      res.redirect(req.baseUrl + '/check-your-answers');
    } else {
      res.redirect(req.baseUrl + '/transport');
    }

  }

});

// --------------------------------------------------
// Q: Can you offer transport or logistics?
// --------------------------------------------------
router.get('/transport', checkHasAnswers, (req, res) => {

  let next = req.baseUrl + '/transport';
  if (req.headers.referer.includes('check-your-answers')) {
    next = next + '?referer=check-your-answers';
  }

  let previous = req.baseUrl + '/accommodation';
  if (req.session.data.answers['offer-accommodation'].includes('yes')) {
    if (req.headers.referer.includes('check-your-answers')) {
      previous = req.baseUrl + '/check-your-answers';
    } else {
      previous = req.baseUrl + '/accommodation-details';
    }
  }

  res.render('transport-logistics', {
    actions: {
      save: next,
      back: previous,
      start: req.baseUrl + '/'
    }
  });
});

router.post('/transport', checkHasAnswers, (req, res) => {

  let next = req.baseUrl + '/transport';
  if (req.query.referer == 'check-your-answers') {
    next = next + '?referer=check-your-answers';
  }

  let previous = req.baseUrl + '/accommodation';
  if (req.session.data.answers['offer-accommodation'].includes('yes')) {
    previous = req.baseUrl + '/accommodation-details';
  }

  let errors = [];

  if (req.session.data.answers['offer-transport-logistics'] === undefined) {
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

    if (req.session.data.answers['offer-transport-logistics'] == 'yes') {

      if (req.query.referer == 'check-your-answers') {
        res.redirect(req.baseUrl + '/transport-details?referer=check-your-answers');
      } else {
        res.redirect(req.baseUrl + '/transport-details');
      }

    } else {

      delete req.session.data.answers['transport-logistics'];

      if (req.query.referer == 'check-your-answers') {
        res.redirect(req.baseUrl + '/check-your-answers');
      } else {
        res.redirect(req.baseUrl + '/space');
      }

    }

  }

});

// --------------------------------------------------
// Q: What kind of transport or logistics can you offer?
// --------------------------------------------------
router.get('/transport-details', checkHasAnswers, (req, res) => {

  let next = req.baseUrl + '/transport-details';
  if (req.headers.referer.includes('check-your-answers') || req.query.referer == 'check-your-answers') {
    next = next + '?referer=check-your-answers';
  }

  res.render('transport-logistics-details', {
    actions: {
      save: next,
      back: req.baseUrl + '/transport',
      start: req.baseUrl + '/'
    }
  });
});

router.post('/transport-details', checkHasAnswers, (req, res) => {

  let next = req.baseUrl + '/transport-details';
  if (req.query.referer == 'check-your-answers') {
    next = next + '?referer=check-your-answers';
  }

  let errors = [];

  if (req.session.data.answers['transport-logistics']['type'] === undefined) {
    let error = {};
    error.fieldName = 'transport-logistics-type';
    error.href = '#transport-logistics-type';
    error.text = 'Choose what kinds of transport or logisitics services you can offer';
    errors.push(error);
  }

  if (!req.session.data.answers['transport-logistics']['description'].length) {
    let error = {};
    error.fieldName = 'transport-logistics-description';
    error.href = '#transport-logistics-description';
    error.text = 'Enter a description of the kind of transport or logistics services you can offer';
    errors.push(error);
  }

  if (errors.length) {

    res.render('transport-logistics-details', {
      errors: errors,
      actions: {
        save: next,
        back: req.baseUrl + '/transport',
        start: req.baseUrl + '/'
      }
    });

  } else {

    if (req.query.referer == 'check-your-answers') {
      res.redirect(req.baseUrl + '/check-your-answers');
    } else {
      res.redirect(req.baseUrl + '/space');
    }

  }

});

// --------------------------------------------------
// Q: Can you offer space?
// --------------------------------------------------
router.get('/space', checkHasAnswers, (req, res) => {

  let next = req.baseUrl + '/space';
  if (req.headers.referer.includes('check-your-answers')) {
    next = next + '?referer=check-your-answers';
  }

  let previous = req.baseUrl + '/transport';
  if (req.session.data.answers['offer-transport-logistics'] == 'yes') {
    if (req.headers.referer.includes('check-your-answers')) {
      previous = req.baseUrl + '/check-your-answers';
    } else {
      previous = req.baseUrl + '/transport-details';
    }
  }

  res.render('space', {
    actions: {
      save: next,
      back: previous,
      start: req.baseUrl + '/'
    }
  });
});

router.post('/space', checkHasAnswers, (req, res) => {

  let next = req.baseUrl + '/space';
  if (req.query.referer == 'check-your-answers') {
    next = next + '?referer=check-your-answers';
  }

  let previous = req.baseUrl + '/transport';
  if (req.session.data.answers['offer-transport-logistics'] == 'yes') {
    previous = req.baseUrl + '/transport-details';
  }

  let errors = [];

  if (req.session.data.answers['offer-space'] === undefined) {
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

    if (req.session.data.answers['offer-space'] == 'yes') {

      if (req.query.referer == 'check-your-answers') {
        res.redirect(req.baseUrl + '/space-details?referer=check-your-answers');
      } else {
        res.redirect(req.baseUrl + '/space-details');
      }

    } else {

      delete req.session.data.answers['space'];

      if (req.query.referer == 'check-your-answers') {
        res.redirect(req.baseUrl + '/check-your-answers');
      } else {
        res.redirect(req.baseUrl + '/staff');
      }

    }

  }

});

// --------------------------------------------------
// Q: What kind of space can you offer?
// --------------------------------------------------
router.get('/space-details', checkHasAnswers, (req, res) => {

  let next = req.baseUrl + '/space-details';
  if (req.headers.referer.includes('check-your-answers') || req.query.referer == 'check-your-answers') {
    next = next + '?referer=check-your-answers';
  }

  res.render('space-details', {
    actions: {
      save: next,
      back: req.baseUrl + '/space',
      start: req.baseUrl + '/'
    }
  });
});

router.post('/space-details', checkHasAnswers, (req, res) => {

  let next = req.baseUrl + '/space-details';
  if (req.query.referer == 'check-your-answers') {
    next = next + '?referer=check-your-answers';
  }

  let errors = [];

  if (req.session.data.answers['space']['type'] === undefined) {
    let error = {};
    error.fieldName = 'space-type';
    error.href = '#space-type';
    error.text = 'Choose what kind of space you can offer';
    errors.push(error);
  } else {

    if (req.session.data.answers['space']['type'].indexOf('warehouse') !== -1 && !req.session.data.answers['space']['quantity']['warehouse'].length) {
      let error = {};
      error.fieldName = 'space-type-warehouse-quantity';
      error.href = '#space-type-warehouse-quantity';
      error.text = 'Enter the approximate total size of warehouse space';
      errors.push(error);
    }

    if (req.session.data.answers['space']['type'].indexOf('office') !== -1 && !req.session.data.answers['space']['quantity']['office'].length) {
      let error = {};
      error.fieldName = 'space-type-office-quantity';
      error.href = '#space-type-office-quantity';
      error.text = 'Enter the approximate total size of office space';
      errors.push(error);
    }

    if (req.session.data.answers['space']['type'].indexOf('other') !== -1 && !req.session.data.answers['space']['quantity']['other'].length) {
      let error = {};
      error.fieldName = 'space-type-other-quantity';
      error.href = '#space-type-other-quantity';
      error.text = 'Enter the approximate total size of all other spaces';
      errors.push(error);
    }

  }

  if (!req.session.data.answers['space']['description'].length) {
    let error = {};
    error.fieldName = 'space-description';
    error.href = '#space-description';
    error.text = 'Enter a description of the kind of space you can offer';
    errors.push(error);
  }

  if (errors.length) {

    res.render('space-details', {
      errors: errors,
      actions: {
        save: next,
        back: req.baseUrl + '/space',
        start: req.baseUrl + '/'
      }
    });

  } else {

    if (req.query.referer == 'check-your-answers') {
      res.redirect(req.baseUrl + '/check-your-answers');
    } else {
      res.redirect(req.baseUrl + '/staff');
    }

  }

});

// --------------------------------------------------
// Q: Can you offer staff?
// --------------------------------------------------
router.get('/staff', checkHasAnswers, (req, res) => {

  let next = req.baseUrl + '/staff';
  if (req.headers.referer.includes('check-your-answers')) {
    next = next + '?referer=check-your-answers';
  }

  let previous = req.baseUrl + '/space';
  if (req.session.data.answers['offer-space'] == 'yes') {
    if (req.headers.referer.includes('check-your-answers')) {
      previous = req.baseUrl + '/check-your-answers';
    } else {
      previous = req.baseUrl + '/space-details';
    }
  }

  res.render('staff', {
    actions: {
      save: next,
      back: previous,
      start: req.baseUrl + '/'
    }
  });
});

router.post('/staff', checkHasAnswers, (req, res) => {

  let next = req.baseUrl + '/staff';
  if (req.query.referer == 'check-your-answers') {
    next = next + '?referer=check-your-answers';
  }

  let previous = req.baseUrl + '/space';
  if (req.session.data.answers['offer-space'] == 'yes') {
    previous = req.baseUrl + '/space-details';
  }

  let errors = [];

  if (req.session.data.answers['offer-staff'] === undefined) {
    let error = {};
    error.fieldName = 'staff';
    error.href = '#staff';
    error.text = 'Choose whether you can offer staff';
    errors.push(error);
  }

  if (errors.length) {

    res.render('staff', {
      errors: errors,
      actions: {
        save: next,
        back: previous,
        start: req.baseUrl + '/'
      }
    });

  } else {

    if (req.session.data.answers['offer-staff'] == 'yes') {

      if (req.query.referer == 'check-your-answers') {
        res.redirect(req.baseUrl + '/staff-details?referer=check-your-answers');
      } else {
        res.redirect(req.baseUrl + '/staff-details');
      }

    } else {

      delete req.session.data.answers['staff'];

      if (req.query.referer == 'check-your-answers') {
        res.redirect(req.baseUrl + '/check-your-answers');
      } else {
        res.redirect(req.baseUrl + '/care');
      }

    }

  }

});

// --------------------------------------------------
// Q: What kind of care can you offer?
// --------------------------------------------------
router.get('/staff-details', checkHasAnswers, (req, res) => {

  let next = req.baseUrl + '/staff-details';
  if (req.headers.referer.includes('check-your-answers') || req.query.referer == 'check-your-answers') {
    next = next + '?referer=check-your-answers';
  }

  res.render('staff-details', {
    actions: {
      save: next,
      back: req.baseUrl + '/staff',
      start: req.baseUrl + '/'
    }
  });
});

router.post('/staff-details', checkHasAnswers, (req, res) => {

  let next = req.baseUrl + '/staff-details';
  if (req.query.referer == 'check-your-answers') {
    next = next + '?referer=check-your-answers';
  }

  let errors = [];

  if (req.session.data.answers['staff']['type'] === undefined) {
    let error = {};
    error.fieldName = 'staff-type';
    error.href = '#staff-type';
    error.text = 'Choose what kind of staff you can offer';
    errors.push(error);
  } else {

    let types = ['cleaners','developers','medical_staff','office_staff','security_staff','trainers_or_coaches','translators','other_staff'];

    types.forEach(element => {
      if (req.session.data.answers['staff']['type'].indexOf(element) !== -1 && !req.session.data.answers['staff']['quantity'][element].length) {
        let error = {};
        error.fieldName = 'staff-quantity-' + element.replace('_','-');
        error.href = '#staff-quantity-' + element.replace('_','-');
        error.text = 'Enter the quantity of ' + element.replace('_',' ');
        errors.push(error);
      }
    });

  }

  if (errors.length) {

    res.render('staff-details', {
      errors: errors,
      actions: {
        save: req.baseUrl + '/staff-details',
        back: req.baseUrl + '/staff',
        start: req.baseUrl + '/'
      }
    });

  } else {

    if (req.query.referer == 'check-your-answers') {
      res.redirect(req.baseUrl + '/check-your-answers');
    } else {
      res.redirect(req.baseUrl + '/care');
    }

  }

});

// --------------------------------------------------
// Q: Can you offer social care or childcare?
// --------------------------------------------------
router.get('/care', checkHasAnswers, (req, res) => {

  let next = req.baseUrl + '/care';
  if (req.headers.referer.includes('check-your-answers')) {
    next = next + '?referer=check-your-answers';
  }

  let previous = req.baseUrl + '/staff';
  if (req.session.data.answers['offer-staff'] == 'yes') {
    if (req.headers.referer.includes('check-your-answers')) {
      previous = req.baseUrl + '/check-your-answers';
    } else {
      previous = req.baseUrl + '/staff-details';
    }
  }

  res.render('care', {
    actions: {
      save: next,
      back: previous,
      start: req.baseUrl + '/'
    }
  });
});

router.post('/care', checkHasAnswers, (req, res) => {

  let next = req.baseUrl + '/care';
  if (req.query.referer == 'check-your-answers') {
    next = next + '?referer=check-your-answers';
  }

  let previous = req.baseUrl + '/staff';
  if (req.session.data.answers['offer-staff'] == 'yes') {
    previous = req.baseUrl + '/staff-details';
  }

  let errors = [];

  if (req.session.data.answers['offer-care'] === undefined) {
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

    if (req.session.data.answers['offer-care'] == 'yes') {

      if (req.query.referer == 'check-your-answers') {
        res.redirect(req.baseUrl + '/care-details?referer=check-your-answers');
      } else {
        res.redirect(req.baseUrl + '/care-details');
      }

    } else {

      delete req.session.data.answers['care'];

      if (req.query.referer == 'check-your-answers') {
        res.redirect(req.baseUrl + '/check-your-answers');
      } else {
        res.redirect(req.baseUrl + '/expertise');
      }

    }

  }

});

// --------------------------------------------------
// Q: What kind of care can you offer?
// --------------------------------------------------
router.get('/care-details', checkHasAnswers, (req, res) => {

  let next = req.baseUrl + '/care-details';
  if (req.headers.referer.includes('check-your-answers') || req.query.referer == 'check-your-answers') {
    next = next + '?referer=check-your-answers';
  }

  res.render('care-details', {
    actions: {
      save: next,
      back: req.baseUrl + '/care',
      start: req.baseUrl + '/'
    }
  });
});

router.post('/care-details', checkHasAnswers, (req, res) => {

  let next = req.baseUrl + '/care-details';
  if (req.query.referer == 'check-your-answers') {
    next = next + '?referer=check-your-answers';
  }

  let errors = [];

  if (req.session.data.answers['care']['type'] === undefined) {
    let error = {};
    error.fieldName = 'care-type';
    error.href = '#care-type';
    error.text = 'Choose what kind of care you can offer';
    errors.push(error);
  }

  if (req.session.data.answers['care']['qualifications'] === undefined) {
    let error = {};
    error.fieldName = 'care-qualifications';
    error.href = '#care-qualifications';
    error.text = 'Choose what qualifications your or people in your business have';
    errors.push(error);
  } else {
    if (req.session.data.answers['care']['qualifications'].indexOf('healthcare') !== -1 && !req.session.data.answers['care']['description']['healthcare'].length) {
      let error = {};
      error.fieldName = 'care-qualifications-healthcare-description';
      error.href = '#care-qualifications-healthcare-description';
      error.text = 'Enter a description of the kind of healthcare qualifications';
      errors.push(error);
    }
  }

  if (errors.length) {

    res.render('care-details', {
      errors: errors,
      actions: {
        save: req.baseUrl + '/care-details',
        back: req.baseUrl + '/care',
        start: req.baseUrl + '/'
      }
    });

  } else {

    if (req.query.referer == 'check-your-answers') {
      res.redirect(req.baseUrl + '/check-your-answers');
    } else {
      res.redirect(req.baseUrl + '/expertise');
    }

  }

});

// --------------------------------------------------
// Q: What kind of expertise can you offer?
// --------------------------------------------------
router.get('/expertise', checkHasAnswers, (req, res) => {

  let next = req.baseUrl + '/expertise';
  if (req.headers.referer.includes('check-your-answers')) {
    next = next + '?referer=check-your-answers';
  }

  let previous = req.baseUrl + '/care';
  if (req.session.data.answers['offer-care'] == 'yes') {
    previous = req.baseUrl + '/care-details';
  }

  if (req.headers.referer.includes('check-your-answers')) {
    previous = req.baseUrl + '/check-your-answers';
  }

  res.render('expertise', {
    actions: {
      save: next,
      back: previous,
      start: req.baseUrl + '/'
    }
  });
});

router.post('/expertise', checkHasAnswers, (req, res) => {

  let next = req.baseUrl + '/expertise';
  if (req.query.referer == 'check-your-answers') {
    next = next + '?referer=check-your-answers';
  }

  let previous = req.baseUrl + '/care';
  if (req.session.data.answers['offer-care'] == 'yes') {
    previous = req.baseUrl + '/care-details';
  }

  let errors = [];

  if (req.session.data.answers['expertise']['type'] === undefined) {
    // let error = {};
    // error.fieldName = 'expertise';
    // error.href = '#expertise';
    // error.text = 'Choose what kinds of expertise you can offer';
    // errors.push(error);
  } else {

    if (req.session.data.answers['expertise']['type'].indexOf('other') !== -1 && !req.session.data.answers['expertise']['description']['other'].length) {
      let error = {};
      error.fieldName = 'expertise-description-other';
      error.href = '#expertise-description-other';
      error.text = 'Enter a description for other types of expertise';
      errors.push(error);
    }

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

    if (req.query.referer == 'check-your-answers') {

      if (req.session.data.answers['expertise']['type'] !== undefined) {

        // delete construction expertise if user hasn't checked the option
        if (req.session.data.answers['expertise']['type'].indexOf('construction') === -1) {
          delete req.session.data.answers['expertise-construction'];
        }

        // delete IT expertise if user hasn't checked the option
        if (req.session.data.answers['expertise']['type'].indexOf('it_services') === -1) {
          delete req.session.data.answers['expertise-it-services'];
        }

        if (req.session.data.answers['expertise']['type'].indexOf('construction') !== -1 && req.session.data.answers['expertise-construction'] === undefined) {
          res.redirect(req.baseUrl + '/expertise-construction?referer=check-your-answers');
        } else if (req.session.data.answers['expertise']['type'].indexOf('it_services') !== -1 && req.session.data.answers['expertise-it-services'] === undefined) {
          res.redirect(req.baseUrl + '/expertise-it-services?referer=check-your-answers');
        } else {
          res.redirect(req.baseUrl + '/check-your-answers');
        }

      } else {

        delete req.session.data.answers['expertise-construction'];
        delete req.session.data.answers['expertise-it-services'];

        res.redirect(req.baseUrl + '/check-your-answers');

      }

    } else {

      if (req.session.data.answers['expertise']['type'] !== undefined) {

        if (req.session.data.answers['expertise']['type'].indexOf('construction') !== -1) {
          res.redirect(req.baseUrl + '/expertise-construction');
        }

        if (req.session.data.answers['expertise']['type'].indexOf('it_services') !== -1) {
          res.redirect(req.baseUrl + '/expertise-it-services');
        }

      } else {
        delete req.session.data.answers['expertise-construction'];
        delete req.session.data.answers['expertise-it-services'];

        res.redirect(req.baseUrl + '/other-support');
      }

    }

  }

});

// --------------------------------------------------
// Q: What kind of construction expertise can you offer?
// --------------------------------------------------
router.get('/expertise-construction', checkHasAnswers, (req, res) => {

  let next = req.baseUrl + '/expertise-construction';
  if (req.headers.referer.includes('check-your-answers') || req.query.referer == 'check-your-answers') {
    next = next + '?referer=check-your-answers';
  }

  let previous = req.baseUrl + '/expertise';
  if (req.headers.referer.includes('check-your-answers')) {
    previous = req.baseUrl + '/check-your-answers';
  }

  res.render('expertise-details-construction', {
    actions: {
      save: next,
      back: previous,
      start: req.baseUrl + '/'
    }
  });
});

router.post('/expertise-construction', checkHasAnswers, (req, res) => {

  let next = req.baseUrl + '/expertise-construction';
  if (req.query.referer == 'check-your-answers') {
    next = next + '?referer=check-your-answers';
  }

  let previous = req.baseUrl + '/expertise';
  if (req.query.referer == 'check-your-answers') {
    previous = req.baseUrl + '/check-your-answers';
  }

  let errors = [];

  if (req.session.data.answers['expertise-construction']['type'] === undefined) {
    let error = {};
    error.fieldName = 'expertise-construction-type';
    error.href = '#expertise-construction-type';
    error.text = 'Choose what kinds of construction services you can offer';
    errors.push(error);
  } else {

    if (req.session.data.answers['expertise-construction']['type'].indexOf('other') !== -1 && !req.session.data.answers['expertise-construction']['description']['other'].length) {
      let error = {};
      error.fieldName = 'expertise-construction-description-other';
      error.href = '#expertise-construction-description-other';
      error.text = 'Enter a description for other types of construction services you can offer';
      errors.push(error);
    }

  }

  if (errors.length) {

    res.render('expertise-details-construction', {
      errors: errors,
      actions: {
        save: next,
        back: previous,
        start: req.baseUrl + '/'
      }
    });

  } else {

    if (req.query.referer == 'check-your-answers') {

      // TODO if the referer is check-your-answers, but IT services is empty, do that first

      res.redirect(req.baseUrl + '/check-your-answers');
    } else {

      if (req.session.data.answers['expertise']['type'].indexOf('it_services') !== -1) {
        res.redirect(req.baseUrl + '/expertise-it-services');
      } else {
        res.redirect(req.baseUrl + '/other-support');
      }

    }

  }

});

// --------------------------------------------------
// Q: What kind of IT services expertise can you offer?
// --------------------------------------------------
router.get('/expertise-it-services', checkHasAnswers, (req, res) => {

  let next = req.baseUrl + '/expertise-it-services';
  if (req.headers.referer.includes('expertise-construction')) {
    next = next + '?referer=expertise-construction';
  }
  if (req.headers.referer.includes('check-your-answers') || req.query.referer == 'check-your-answers') {
    next = next + '?referer=check-your-answers';
  }

  let previous = req.baseUrl + '/expertise';
  if (req.headers.referer.includes('expertise-construction') || req.session.data.answers['expertise']['type'].indexOf('construction') !== -1) {
    previous = req.baseUrl + '/expertise-construction';
  }
  if (req.headers.referer.includes('check-your-answers')) {
    previous = req.baseUrl + '/check-your-answers';
  }

  res.render('expertise-details-it-services', {
    actions: {
      save: next,
      back: previous,
      start: req.baseUrl + '/'
    }
  });
});

router.post('/expertise-it-services', checkHasAnswers, (req, res) => {

  let next = req.baseUrl + '/expertise-it-services';
  if (req.query.referer == 'check-your-answers') {
    next = next + '?referer=check-your-answers';
  }

  let previous = req.baseUrl + '/expertise';
  if (req.query.referer == 'expertise-construction') {
    previous = req.baseUrl + '/expertise-construction';
  }
  if (req.query.referer == 'check-your-answers') {
    previous = req.baseUrl + '/check-your-answers';
  }

  let errors = [];

  if (req.session.data.answers['expertise-it-services']['type'] === undefined) {
    let error = {};
    error.fieldName = 'expertise-it-services-type';
    error.href = '#expertise-it-services-type';
    error.text = 'Choose what kinds of IT services you can offer';
    errors.push(error);
  } else {

    if (req.session.data.answers['expertise-it-services']['type'].indexOf('other') !== -1 && !req.session.data.answers['expertise-it-services']['description']['other'].length) {
      let error = {};
      error.fieldName = 'expertise-it-services-description-other';
      error.href = '#expertise-it-services-description-other';
      error.text = 'Enter a description for other types of IT services you can offer';
      errors.push(error);
    }

  }

  if (errors.length) {

    res.render('expertise-details-it-services', {
      errors: errors,
      actions: {
        save: next,
        back: previous,
        start: req.baseUrl + '/'
      }
    });

  } else {

    if (req.query.referer == 'check-your-answers') {
      res.redirect(req.baseUrl + '/check-your-answers');
    } else {
      res.redirect(req.baseUrl + '/other-support');
    }

  }

});

// --------------------------------------------------
// Q: Can you offer any other kind of support?
// --------------------------------------------------
router.get('/other-support', checkHasAnswers, (req, res) => {

  let next = req.baseUrl + '/other-support';
  if (req.headers.referer.includes('check-your-answers')) {
    next = next + '?referer=check-your-answers';
  }

  let previous = req.baseUrl + '/expertise';
  if (req.headers.referer.includes('expertise-construction')) {
    previous = req.baseUrl + '/expertise-construction';
  }
  if (req.headers.referer.includes('expertise-it-services')) {
    previous = req.baseUrl + '/expertise-it-services';
  }
  if (req.headers.referer.includes('check-your-answers')) {
    previous = req.baseUrl + '/check-your-answers';
  }

  res.render('other-support', {
    actions: {
      save: next,
      back: previous,
      start: req.baseUrl + '/'
    }
  });
});

router.post('/other-support', checkHasAnswers, (req, res) => {

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

    if (req.query.referer == 'check-your-answers') {
      res.redirect(req.baseUrl + '/check-your-answers');
    } else {
      res.redirect(req.baseUrl + '/location');
    }

  }

});

// --------------------------------------------------
// Q: Where can you offer your services?
// --------------------------------------------------
router.get('/location', checkHasAnswers, (req, res) => {

  let next = req.baseUrl + '/location';
  if (req.headers.referer.includes('check-your-answers')) {
    next = next + '?referer=check-your-answers';
  }

  let previous = req.baseUrl + '/other-support';
  if (req.headers.referer.includes('check-your-answers')) {
    previous = req.baseUrl + '/check-your-answers';
  }

  res.render('location', {
    actions: {
      save: next,
      back: previous,
      start: req.baseUrl + '/'
    }
  });
});

router.post('/location', checkHasAnswers, (req, res) => {

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

    if (req.query.referer == 'check-your-answers') {
      res.redirect(req.baseUrl + '/check-your-answers');
    } else {
      res.redirect(req.baseUrl + '/business-details');
    }

  }

});

// --------------------------------------------------
// Your business details
// --------------------------------------------------
router.get('/business-details', checkHasAnswers, (req, res) => {

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

router.post('/business-details', checkHasAnswers, (req, res) => {

  let next = req.baseUrl + '/business-details';
  if (req.query.referer == 'check-your-answers') {
    next = next + '?referer=check-your-answers';
  }

  let errors = [];

  if (!req.session.data.answers['company']['name'].length) {
    let error = {};
    error.fieldName = 'company-name';
    error.href = '#company-name';
    error.text = 'Enter a company name';
    errors.push(error);
  }

  // if (!req.session.data.answers['company']['number'].length) {
  //   let error = {};
  //   error.fieldName = 'company-number';
  //   error.href = '#company-number';
  //   error.text = 'Enter a company number';
  //   errors.push(error);
  // }

  if (req.session.data.answers['company']['size'] === undefined) {
    let error = {};
    error.fieldName = 'company-size';
    error.href = '#company-size';
    error.text = 'Choose a company size';
    errors.push(error);
  }

  if (req.session.data.answers['company']['location'] === undefined) {
    let error = {};
    error.fieldName = 'company-location';
    error.href = '#company-location';
    error.text = 'Choose the location of the company’s main office';
    errors.push(error);
  } else {
    if (req.session.data.answers['company']['location'] == 'uk' && !req.session.data.answers['company']['postcode'].length) {
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

    if (req.query.referer == 'check-your-answers') {
      res.redirect(req.baseUrl + '/check-your-answers');
    } else {
      res.redirect(req.baseUrl + '/contact-details');
    }

  }

});

// --------------------------------------------------
// Your contact details
// --------------------------------------------------
router.get('/contact-details', checkHasAnswers, (req, res) => {

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

router.post('/contact-details', checkHasAnswers, (req, res) => {

  let next = req.baseUrl + '/contact-details';
  if (req.query.referer == 'check-your-answers') {
    next = next + '?referer=check-your-answers';
  }

  let errors = [];

  if (!req.session.data.answers['contact']['name'].length) {
    let error = {};
    error.fieldName = 'contact-name';
    error.href = '#contact-name';
    error.text = 'Enter name of main contact';
    errors.push(error);
  }

  // if (!req.session.data.answers['contact']['role'].length) {
  //   let error = {};
  //   error.fieldName = 'contact-role';
  //   error.href = '#contact-role';
  //   error.text = 'Enter role of main contact';
  //   errors.push(error);
  // }

  if (!req.session.data.answers['contact']['phone'].length) {
    let error = {};
    error.fieldName = 'contact-phone';
    error.href = '#contact-phone';
    error.text = 'Enter phone number of main contact';
    errors.push(error);
  }

  if (!req.session.data.answers['contact']['email'].length) {
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

// ----------------------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------

// --------------------------------------------------
// Q: What kind of business are you?
// --------------------------------------------------
router.get('/business-type', checkHasAnswers, (req, res) => {

  let next = req.baseUrl + '/business-type';
  if (req.headers.referer.includes('check-your-answers')) {
    next = next + '?referer=check-your-answers';
  }

  let previous = req.baseUrl + '/medical-equipment';

  res.render('business-type', {
    actions: {
      save: next,
      back: previous,
      start: req.baseUrl + '/'
    }
  });
});

router.post('/business-type', checkHasAnswers, (req, res) => {

  let next = req.baseUrl + '/business-type';
  if (req.query.referer == 'check-your-answers') {
    next = next + '?referer=check-your-answers';
  }

  let errors = [];

  if (req.session.data.answers['business-type'] === undefined) {
    let error = {};
    error.fieldName = 'business-type';
    error.href = '#business-type';
    error.text = 'Choose what kind of business you are';
    errors.push(error);
  }

  if (errors.length) {

    res.render('business-type', {
      errors: errors,
      actions: {
        save: next,
        back: req.baseUrl + '/medical-equipment',
        start: req.baseUrl + '/'
      }
    });

  } else {

    if (req.query.referer == 'check-your-answers') {
      res.redirect(req.baseUrl + '/check-your-answers');
    } else {
      res.redirect(req.baseUrl + '/medical-equipment-type');
    }

  }

});

// --------------------------------------------------
// Q: What kind of medical equipment can you offer?
// --------------------------------------------------
router.get('/medical-equipment-type', checkHasAnswers, (req, res) => {

  let next = req.baseUrl + '/medical-equipment-type';
  if (req.headers.referer.includes('check-your-answers')) {
    next = next + '?referer=check-your-answers';
  }

  let previous = req.baseUrl + '/business-type';

  res.render('medical-equipment-type', {
    actions: {
      save: next,
      back: previous,
      start: req.baseUrl + '/'
    }
  });
});

router.post('/medical-equipment-type', checkHasAnswers, (req, res) => {

  // let next = req.baseUrl + '/medical-equipment-type';
  // if (req.query.referer == 'check-your-answers') {
  //   next = next + '?referer=check-your-answers';
  // }

  let errors = [];

  if (req.session.data.answers['medical-equipment-type'] === undefined) {
    let error = {};
    error.fieldName = 'medical-equipment-type';
    error.href = '#medical-equipment-type';
    error.text = 'Choose what type of medical equipment you can offer';
    errors.push(error);
  }

  if (errors.length) {

    res.render('medical-equipment-type', {
      errors: errors,
      actions: {
        save: req.baseUrl + '/medical-equipment-type',
        back: req.baseUrl + '/business-type',
        start: req.baseUrl + '/'
      }
    });

  } else {

    if (req.session.data.answers['medical-equipment-type'] == 'ppe') {

      res.redirect(req.baseUrl + '/medical-equipment-ppe');

    } else if (req.session.data.answers['medical-equipment-type'] == 'testing') {

      // delete the product as we don't need it
      // if (req.session.data.answers['product'] !== undefined) {
      //   delete req.session.data.answers['product'];
      // }

      res.redirect(req.baseUrl + '/medical-equipment-testing');

    } else {

      // delete the product type as we don't need it
      // if (req.session.data.answers['product']['type'] !== undefined) {
      //   delete req.session.data.answers['product']['type'];
      // }

      res.redirect(req.baseUrl + '/medical-equipment-other');

    }

  }

});

// --------------------------------------------------
// Q: Tell us about the product you're offering – PPE
// --------------------------------------------------
router.get('/medical-equipment-ppe', checkHasAnswers, (req, res) => {

  let next = req.baseUrl + '/medical-equipment-ppe';
  if (req.headers.referer.includes('check-your-answers')) {
    next = next + '?referer=check-your-answers';
  }

  let previous = req.baseUrl + '/medical-equipment-type';

  res.render('medical-equipment-ppe', {
    actions: {
      save: next,
      back: previous,
      start: req.baseUrl + '/'
    }
  });
});

router.post('/medical-equipment-ppe', checkHasAnswers, (req, res) => {

  let next = req.baseUrl + '/medical-equipment-ppe';
  if (req.query.referer == 'check-your-answers') {
    next = next + '?referer=check-your-answers';
  }

  let errors = [];

  if (!req.session.data.answers['product']['name'].length) {
    let error = {};
    error.fieldName = 'product-name';
    error.href = '#product-name';
    error.text = 'Enter the name of the product';
    errors.push(error);
  }

  if (req.session.data.answers['product']['type'] === undefined) {
    let error = {};
    error.fieldName = 'product-type';
    error.href = '#product-type';
    error.text = 'Choose the type of equipment';
    errors.push(error);
  } else {
    if (req.session.data.answers['product']['type'] == 'other' && !req.session.data.answers['product']['type-other'].length) {
      let error = {};
      error.fieldName = 'product-type-other';
      error.href = '#product-type-other';
      error.text = 'Enter a summary of the type of equipment';
      errors.push(error);
    }
  }

  if (!req.session.data.answers['product']['quantity'].length) {
    let error = {};
    error.fieldName = 'product-quantity';
    error.href = '#product-quantity';
    error.text = 'Enter the quantity of this product';
    errors.push(error);
  }

  if (!req.session.data.answers['product']['cost'].length) {
    let error = {};
    error.fieldName = 'product-cost';
    error.href = '#product-cost';
    error.text = 'Enter the cost of this product';
    errors.push(error);
  }

  if (!req.session.data.answers['product']['certification'].length) {
    let error = {};
    error.fieldName = 'product-certification';
    error.href = '#product-certification';
    error.text = 'Enter the product’s certification details';
    errors.push(error);
  }

  if (req.session.data.answers['product']['location'] === undefined) {
    let error = {};
    error.fieldName = 'product-location';
    error.href = '#product-location';
    error.text = 'Choose where the product is made or stored';
    errors.push(error);
  } else {
    if (req.session.data.answers['product']['location'] == 'uk' && !req.session.data.answers['product']['postcode'].length) {
      let error = {};
      error.fieldName = 'product-postcode';
      error.href = '#product-postcode';
      error.text = 'Enter a postcode';
      errors.push(error);
    }
  }

  // if (!req.session.data.answers['product']['url'].length) {
  //   let error = {};
  //   error.fieldName = 'product-url';
  //   error.href = '#product-url';
  //   error.text = 'Enter a URL of the product specification document';
  //   errors.push(error);
  // }

  if (!req.session.data.answers['product']['lead-time'].length) {
    let error = {};
    error.fieldName = 'product-lead-time';
    error.href = '#product-lead-time';
    error.text = 'Enter a lead time in days';
    errors.push(error);
  }

  if (errors.length) {

    res.render('medical-equipment-ppe', {
      errors: errors,
      actions: {
        save: next,
        back: req.baseUrl + '/medical-equipment-type',
        start: req.baseUrl + '/'
      }
    });

  } else {

    res.redirect(req.baseUrl + '/another-product');

  }

});

// --------------------------------------------------
// Q: Tell us about the product you're offering – Testing
// --------------------------------------------------
router.get('/medical-equipment-testing', checkHasAnswers, (req, res) => {

  let next = req.baseUrl + '/another-product';
  if (req.headers.referer.includes('check-your-answers')) {
    next = next + '?referer=check-your-answers';
  }

  let previous = req.baseUrl + '/medical-equipment-type';

  res.render('medical-equipment-testing', {
    actions: {
      save: next,
      back: previous,
      start: req.baseUrl + '/'
    }
  });
});

// --------------------------------------------------
// Q: Tell us about the product you're offering – Other
// --------------------------------------------------
router.get('/medical-equipment-other', checkHasAnswers, (req, res) => {

  let next = req.baseUrl + '/medical-equipment-other';
  if (req.headers.referer.includes('check-your-answers')) {
    next = next + '?referer=check-your-answers';
  }

  let previous = req.baseUrl + '/medical-equipment-type';

  res.render('medical-equipment-other', {
    actions: {
      save: next,
      back: previous,
      start: req.baseUrl + '/'
    }
  });
});

router.post('/medical-equipment-other', checkHasAnswers, (req, res) => {

  let next = req.baseUrl + '/medical-equipment-other';
  if (req.query.referer == 'check-your-answers') {
    next = next + '?referer=check-your-answers';
  }

  let errors = [];

  if (!req.session.data.answers['product']['name'].length) {
    let error = {};
    error.fieldName = 'product-name';
    error.href = '#product-name';
    error.text = 'Enter the name of the product';
    errors.push(error);
  }

  if (!req.session.data.answers['product']['quantity'].length) {
    let error = {};
    error.fieldName = 'product-quantity';
    error.href = '#product-quantity';
    error.text = 'Enter the quantity of this product';
    errors.push(error);
  }

  if (!req.session.data.answers['product']['cost'].length) {
    let error = {};
    error.fieldName = 'product-cost';
    error.href = '#product-cost';
    error.text = 'Enter the cost of this product';
    errors.push(error);
  }

  if (!req.session.data.answers['product']['certification'].length) {
    let error = {};
    error.fieldName = 'product-certification';
    error.href = '#product-certification';
    error.text = 'Enter the product’s certification details';
    errors.push(error);
  }

  if (req.session.data.answers['product']['location'] === undefined) {
    let error = {};
    error.fieldName = 'product-location';
    error.href = '#product-location';
    error.text = 'Choose where the product is made or stored';
    errors.push(error);
  } else {
    if (req.session.data.answers['product']['location'] == 'uk' && !req.session.data.answers['product']['postcode'].length) {
      let error = {};
      error.fieldName = 'product-postcode';
      error.href = '#product-postcode';
      error.text = 'Enter a postcode';
      errors.push(error);
    }
  }

  // if (!req.session.data.answers['product']['url'].length) {
  //   let error = {};
  //   error.fieldName = 'product-url';
  //   error.href = '#product-url';
  //   error.text = 'Enter a URL of the product specification document';
  //   errors.push(error);
  // }

  if (!req.session.data.answers['product']['lead-time'].length) {
    let error = {};
    error.fieldName = 'product-lead-time';
    error.href = '#product-lead-time';
    error.text = 'Enter a lead time in days';
    errors.push(error);
  }

  if (errors.length) {

    res.render('medical-equipment-other', {
      errors: errors,
      actions: {
        save: next,
        back: req.baseUrl + '/medical-equipment-type',
        start: req.baseUrl + '/'
      }
    });

  } else {

    res.redirect(req.baseUrl + '/another-product');

  }

});

// --------------------------------------------------
// Q: Can you offer another product?
// --------------------------------------------------
router.get('/another-product', checkHasAnswers, (req, res) => {

  let next = req.baseUrl + '/another-product';
  if (req.headers.referer.includes('check-your-answers')) {
    next = next + '?referer=check-your-answers';
  }

  let previous = req.baseUrl + '/medical-equipment-other';
  if (req.session.data.answers['medical-equipment-type'] == 'ppe') {
    previous = req.baseUrl + '/medical-equipment-ppe';
  }
  if (req.session.data.answers['medical-equipment-type'] == 'testing') {
    previous = req.baseUrl + '/medical-equipment-testing';
  }

  res.render('another-product', {
    actions: {
      save: next,
      back: previous,
      start: req.baseUrl + '/'
    }
  });
});

router.post('/another-product', checkHasAnswers, (req, res) => {

  let next = req.baseUrl + '/another-product';
  if (req.query.referer == 'check-your-answers') {
    next = next + '?referer=check-your-answers';
  }

  let previous = req.baseUrl + '/medical-equipment-other';
  if (req.session.data.answers['medical-equipment-type'] == 'ppe') {
    previous = req.baseUrl + '/medical-equipment-ppe';
  }
  if (req.session.data.answers['medical-equipment-type'] == 'testing') {
    previous = req.baseUrl + '/medical-equipment-testing';
  }

  if (req.session.data.answers['products'] === undefined) {
    req.session.data.answers['products'] = [];
  }

  let errors = [];

  if (req.session.data.answers['another-product'] === undefined) {
    let error = {};
    error.fieldName = 'another-product';
    error.href = '#another-product';
    error.text = 'Choose whether you can offer another product';
    errors.push(error);
  }

  if (errors.length) {

    res.render('another-product', {
      errors: errors,
      actions: {
        save: next,
        back: previous,
        start: req.baseUrl + '/'
      }
    });

  } else {

    // give the product an ID for easy retrieval later
    req.session.data.answers['product']['id'] = uuid();

    // push the product into the products array
    req.session.data.answers['products'].push(req.session.data.answers['product']);

    // delete the product object as we no longer need it
    delete req.session.data.answers['product'];

    // reset the medical equipment type question answer, forcing a new answer
    req.session.data.answers['medical-equipment-type'] = "";

    if (req.session.data.answers['another-product'] == 'yes') {

      // reset the another product question answer, forcing a new answer
      req.session.data.answers['another-product'] = "";

      res.redirect(req.baseUrl + '/medical-equipment-type');

    } else {

      res.redirect(req.baseUrl + '/accommodation');

    }

  }

});

// ----------------------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------

// --------------------------------------------------
// Check your answers
// --------------------------------------------------
router.get('/check-your-answers', checkHasAnswers, (req, res) => {

  res.render('check-your-answers', {
    actions: {
      next: req.baseUrl + '/confirmation',
      back: req.baseUrl + '/contact-details',
      start: req.baseUrl + '/'
    }
  });

});

// --------------------------------------------------
// Confirmation
// --------------------------------------------------
router.get('/confirmation', checkHasAnswers, (req, res) => {

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
