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
      start: req.baseUrl + '/accommodation'
    }
  });
});

// --------------------------------------------------
// Q: Can you offer accommodation?
// --------------------------------------------------
router.get('/accommodation', (req, res) => {

  if (req.session.data.answers === undefined) {
    req.session.data.answers = {};
  }

  let next = req.baseUrl + '/accommodation';
  if (req.headers.referer.includes('check-your-answers')) {
    next = next + '?referer=check-your-answers';
  }

  let previous = req.baseUrl + '/';
  // if (req.headers.referer.includes('check-your-answers')) {
  //   previous = req.baseUrl + '/check-your-answers';
  // } else if (req.headers.referer.includes('medical-equipment-ppe')) {
  //   previous = req.baseUrl + '/medical-equipment-ppe';
  // } else if (req.headers.referer.includes('medical-equipment-testing')) {
  //   previous = req.baseUrl + '/medical-equipment-testing';
  // }

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
    error.text = 'Select whether you can offer medical equipment';
    errors.push(error);
  }

  if (errors.length) {

    res.render('accommodation', {
      errors: errors,
      actions: {
        save: next,
        back: req.baseUrl + '/',
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

  if (req.session.data.answers['accommodation']['cost'] === undefined) {
    let error = {};
    error.fieldName = 'accommodation-cost';
    error.href = '#accommodation-cost';
    error.text = 'Select how much you would charge';
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

  res.render('transport', {
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

  if (req.session.data.answers['offer-transport'] === undefined) {
    let error = {};
    error.fieldName = 'transport';
    error.href = '#transport';
    error.text = 'Select whether you can offer transport or logistics';
    errors.push(error);
  }

  if (errors.length) {

    res.render('transport', {
      errors: errors,
      actions: {
        save: next,
        back: previous,
        start: req.baseUrl + '/'
      }
    });

  } else {

    if (req.session.data.answers['offer-transport'] == 'yes') {

      if (req.query.referer == 'check-your-answers') {
        res.redirect(req.baseUrl + '/transport-details?referer=check-your-answers');
      } else {
        res.redirect(req.baseUrl + '/transport-details');
      }

    } else {

      delete req.session.data.answers['transport'];

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

  res.render('transport-details', {
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

  if (req.session.data.answers['transport']['type'] === undefined) {
    let error = {};
    error.fieldName = 'transport-type';
    error.href = '#transport-type';
    error.text = 'Select what kinds of transport or logisitics services you can offer';
    errors.push(error);
  }

  // if (!req.session.data.answers['transport']['description'].length) {
  //   let error = {};
  //   error.fieldName = 'transport-description';
  //   error.href = '#transport-description';
  //   error.text = 'Enter a description of the kind of transport or logistics services you can offer';
  //   errors.push(error);
  // }

  if (req.session.data.answers['transport']['cost'] === undefined) {
    let error = {};
    error.fieldName = 'transport-cost';
    error.href = '#transport-cost';
    error.text = 'Select how much you would charge';
    errors.push(error);
  }

  if (errors.length) {

    res.render('transport-details', {
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
  if (req.session.data.answers['offer-transport'] == 'yes') {
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
  if (req.session.data.answers['offer-transport'] == 'yes') {
    previous = req.baseUrl + '/transport-details';
  }

  let errors = [];

  if (req.session.data.answers['offer-space'] === undefined) {
    let error = {};
    error.fieldName = 'space';
    error.href = '#space';
    error.text = 'Select whether you can offer space';
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
    error.text = 'Select what kind of space you can offer';
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

  // if (!req.session.data.answers['space']['description'].length) {
  //   let error = {};
  //   error.fieldName = 'space-description';
  //   error.href = '#space-description';
  //   error.text = 'Enter a description of the kind of space you can offer';
  //   errors.push(error);
  // }

  if (req.session.data.answers['space']['cost'] === undefined) {
    let error = {};
    error.fieldName = 'space-cost';
    error.href = '#space-cost';
    error.text = 'Select how much you would charge';
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
    error.text = 'Select whether you can offer staff';
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
// Q: What kind of staff can you offer?
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
    error.text = 'Select what kind of staff you can offer';
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

  if (req.session.data.answers['staff']['cost'] === undefined) {
    let error = {};
    error.fieldName = 'staff-cost';
    error.href = '#staff-cost';
    error.text = 'Select how much you would charge';
    errors.push(error);
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
    error.text = 'Select whether you can offer social care or childcare';
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
    error.text = 'Select what kind of care you can offer';
    errors.push(error);
  }

  if (req.session.data.answers['care']['qualifications'] === undefined) {
    let error = {};
    error.fieldName = 'care-qualifications';
    error.href = '#care-qualifications';
    error.text = 'Select what qualifications your or people in your business have';
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

  if (req.session.data.answers['care']['cost'] === undefined) {
    let error = {};
    error.fieldName = 'care-cost';
    error.href = '#care-cost';
    error.text = 'Select how much you would charge';
    errors.push(error);
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
    // error.text = 'Select what kinds of expertise you can offer';
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
        } else if (req.session.data.answers['expertise']['type'].indexOf('it_services') !== -1) {
          res.redirect(req.baseUrl + '/expertise-it-services');
        } else {
          res.redirect(req.baseUrl + '/other-support');
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
    error.text = 'Select what kinds of construction services you can offer';
    errors.push(error);
  }

  if (req.session.data.answers['expertise-construction']['cost'] === undefined) {
    let error = {};
    error.fieldName = 'expertise-construction-cost';
    error.href = '#expertise-construction-cost';
    error.text = 'Select how much you would charge';
    errors.push(error);
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
    error.text = 'Select what kinds of IT services you can offer';
    errors.push(error);
  }

  if (req.session.data.answers['expertise-it-services']['cost'] === undefined) {
    let error = {};
    error.fieldName = 'expertise-it-services-cost';
    error.href = '#expertise-it-services-cost';
    error.text = 'Select how much you would charge';
    errors.push(error);
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
    error.text = 'Select where you can offer your services';
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

  if (req.session.data.answers['company']['registered'] === undefined) {
    let error = {};
    error.fieldName = 'company-registered';
    error.href = '#company-registered';
    error.text = 'Select if your company is registered in the UK';
    errors.push(error);
  } else {
    if (req.session.data.answers['company']['registered'] == 'yes' && !req.session.data.answers['company']['number'].length) {
      let error = {};
      error.fieldName = 'company-number';
      error.href = '#company-number';
      error.text = 'Enter a company number';
      errors.push(error);
    }
  }

  if (req.session.data.answers['company']['size'] === undefined) {
    let error = {};
    error.fieldName = 'company-size';
    error.href = '#company-size';
    error.text = 'Select a company size';
    errors.push(error);
  }

  if (req.session.data.answers['company']['location'] === undefined) {
    let error = {};
    error.fieldName = 'company-location';
    error.href = '#company-location';
    error.text = 'Select the location of the company’s main office';
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
router.get('/confirmation', (req, res) => {

  res.render('confirmation', {
    actions: {
      start: req.baseUrl + '/'
    }
  });

});

// --------------------------------------------------
// Coordination centres
// --------------------------------------------------
router.get('/coordination-centres', (req, res) => {

  res.render('coordination-centres', {
    actions: {
      back: req.headers.referer
    }
  });

});

// --------------------------------------------------
// Add routes above this line
// --------------------------------------------------
module.exports = router
