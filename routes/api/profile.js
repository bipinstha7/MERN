const express = require("express");
const router = express.Router();
const passport = require("passport");

// load model
const Profile = require("../../models/Profile");
const User = require("../../models/User");

// load validation
const validateProfileInput = require("../../validation/profile");
const validateExperienceInput = require("../../validation/experience");
const validateEducationInput = require("../../validation/education");


// @route   GET /api/profile/test
// @desc    Tests profile route
// @access  Public 
router.get("/test", (req, res) => {
  res.json("profile");
});

// @route   GET /api/profile
// @desc    Get current user's profile
// @access  Private
router.get("/", passport.authenticate("jwt", { session: false }), (req, res) => {
  const errors = {};

  Profile.findOne({ user: req.user._id })
    .populate("user", ["name", "avatar"])
    .then(profile => {
      if (!profile) {
        errors.noprofile = "There is no profile for this user";
        return res.status(400).json(errors);
      }
      res.json(profile);
    })
    .catch(err => res.status(404).json(err));
});

// @route   Get /api/profile/all
// @desc    get all profiles
// @access  Public
router.get("/all", (req, res) => {
  const errors = {};
  Profile.find()
    .populate('user', ["name", "avatar"])
    .then(profile => {
      if(!profile) {
        errors.noprofile = "There is no profiles";
        return res.status(404).json(errors);
      }
      res.json(profile);
    })
    .catch(err => res.status(404).json({profile: "There are no profiles"}));

});


// @route   Get /api/profile/handle/:handle
// @desc    get profile by handle
// @access  Public
router.get("/handle/:handle", (req, res) => {
  const errors = {};

  Profile.findOne({ handle: req.params.handle })
    .populate("user", ["name", "avatar"])
    .then(profile => {
      if (!profile) {
        errors.noprofile = "There is no profile for this user";
        res.status(404).json(errors);
      } else {
        res.json(profile);
      }
    })
    .catch(err => res.status(404).json(error));
});

// @route   Get /api/profile/user/:user_id
// @desc    get profile by user id
// @access  Public
router.get("/user/:user_id", (req, res) => {
  const errors = {};

  Profile.findOne({ user: req.params.user_id })
    .populate("user", ["name", "avatar"])
    .then(profile => {
      if (!profile) {
        errors.noprofile = "There is no profile for this user";
        res.status(404).json(errors);
      } else {
        res.json(profile);
      }
    })
    .catch(err => res.status(404).json({profile: "There is no profile for this user"}));
});


// @route   POST /api/profile
// @desc    create or edit user profile
// @access  Private
router.post("/", passport.authenticate("jwt", { session: false }), (req, res) => {
  const { errors, isValid } = validateProfileInput(req.body);

  // check validation
  if (!isValid) {
    // return errors with 400 status
    return res.status(400).json(errors);
  }

  const newProfile = {
    user: req.user._id
  };

  if (req.body.handle) newProfile.handle = req.body.handle;
  if (req.body.company) newProfile.company = req.body.company;
  if (req.body.website) newProfile.website = req.body.website;
  if (req.body.location) newProfile.location = req.body.location;
  if (req.body.bio) newProfile.bio = req.body.bio;
  if (req.body.status) newProfile.status = req.body.status;
  if (req.body.githubusername) newProfile.githubusername = req.body.githubusername;

  // skills - split into array
  if (typeof req.body.skills !== "undefined") {
    newProfile.skills = req.body.skills.split(",");
  }

  // social 
  newProfile.social = {};
  if (req.body.youtube) newProfile.social.youtube = req.body.youtube;
  if (req.body.facebook) newProfile.social.facebook = req.body.facebook;
  if (req.body.twitter) newProfile.social.twitter = req.body.twitter;
  if (req.body.linkedin) newProfile.social.linkedin = req.body.linkedin;
  if (req.body.nstagram) newProfile.social.instagram = req.body.instagram;

  Profile.findOne({ user: req.user._id })
    .then(profile => {
      if (profile) {
        // update profile (no create)
        Profile.findOneAndUpdate({ user: req.user._id }, { $set: newProfile }, { new: true })
          .then(updatedProfile => res.json(updatedProfile))
          .catch(err => console.log("Error on updating profile", err));
      } else {
        // create profile (no update)
        // check if handle exist
        Profile.findOne({ handle: newProfile.handle })
          .then(profile => {
            if (profile) {
              errors.handle = "That handle already exists"
              res.status(400).json("handle errors", errors);
            } else {
              Profile.create(newProfile)
                .then(createdProfile => res.json(createdProfile))
                .catch(err => console.log("Error on creating new profile", err));
            }
          })
          .catch(err => console.log("Errormon finding handle profile", err));
      }
    });
});

// @route   POST /api/profile/experience
// @desc    add experience to profile
// @access  Private
router.post("/experience", passport.authenticate("jwt", {session: false}), (req, res) => {
  const { errors, isValid } = validateExperienceInput(req.body);

  // check validation
  if (!isValid) {
    // return errors with 400 status
    return res.status(400).json(errors);
  }


  Profile.findOne({user: req.user._id})
    .then(profile => {
      const newExp = {
        title: req.body.title,
        company: req.body.company,
        location: req.body.location,
        from: req.body.from,
        to: req.body.to,
        current: req.body.current,
        description: req.body.description
      }

      // add to experience array
      profile.experience.unshift(newExp);
      profile.save()
        .then(profile => res.json(profile))
        .catch(err => res.status(404).json({error: "Error saving new experience"}));
    })
    .catch(err => res.status(400).json(err));
});

// @route   POST /api/profile/education
// @desc    add education to profile
// @access  Private
router.post("/education", passport.authenticate("jwt", {session: false}), (req, res) => {
  const { errors, isValid } = validateEducationInput(req.body);

  // check validation
  if (!isValid) {
    // return errors with 400 status
    return res.status(400).json(errors);
  }


  Profile.findOne({user: req.user._id})
    .then(profile => {
      const newEdu = {
        school: req.body.school,
        degree: req.body.degree,
        fieldofstudy: req.body.fieldofstudy,
        from: req.body.from,
        to: req.body.to,
        current: req.body.current,
        description: req.body.description
      }

      // add to experience array
      profile.education.unshift(newEdu);
      profile.save()
        .then(profile => res.json(profile))
        .catch(err => res.status(404).json({error: "Error saving new education"}));
    })
    .catch(err => res.status(400).json(err));
});

// @route   DELETE /api/profile/experience/:exp_id
// @desc    delete experience from profile
// @access  Private
router.delete("/experience/:exp_id", passport.authenticate("jwt", {session: false}), (req, res) => {

  Profile.findOne({user: req.user._id})
    .then(profile => {
      // Get remove index
      const removeIndex = profile.experience
        .map(item => item.id)
        .indexOf(req.params.exp_id);

      // splice out of array
      profile.experience.splice(removeIndex, 1);

      profile.save()
        .then(profile => res.json(profile))
        .catch(err => res.status(404).json(err));
    })
    .catch(err => res.status(404).json(err));
});

// @route   DELETE /api/profile/education/:edu_id
// @desc    delete education from profile
// @access  Private
router.delete("/education/:edu_id", passport.authenticate("jwt", {session: false}), (req, res) => {

  Profile.findOne({user: req.user._id})
    .then(profile => {
      // Get remove index
      const removeIndex = 
        profile.education.map(item => item.id)
          .indexOf(req.params.exp_id);

      // splice out of array
      profile.education.splice(removeIndex, 1);

      profile.save()
        .then(profile => res.json(profile))
        .catch(err => res.status(404).json(err));
    })
    .catch(err => res.status(404).json(err));
});

// @route   DELETE /api/profile
// @desc    delete user and profile
// @access  Private
router.delete("/", passport.authenticate("jwt", {session: false}), (req, res) => {

  Profile.findOneAndRemove({user: req.user._id})
    .then(() => {
      User.findByIdAndRemove(req.user._id)
        .then(() => res.json({success: true}))
    })
    .catch(err => res.status(404).json(err));
});

module.exports = router;