const express = require("express");
const router = express.Router();
const passport = require("passport");

// load model
const Profile = require("../../models/Profile");
const User = require("../../models/User");

// load validation
const validateProfileInput = require("../../validation/profile");


// @route   GET /api/profile/test
// @desc    Tests profile route
// @access  Public 
router.get("/test", (req, res) => {
  res.json("profile");
});

// @route   GET /api/profile
// @desc    Get current user's profile
// @access  Private
router.get("/", passport.authenticate("jwt", {session: false}), (req, res) => {
  const errors = {};

  Profile.findOne({user: req.user._id})
  .populate("user", ["name", "avatar"])  
  .then(profile => {
      if(!profile) {
        errors.noprofile = "There is no profile for this user";
        return res.status(400).json(errors);
      } 
      res.json(profile);
    })
    .catch(err => res.status(404).json(err));
});

// @route   POST /api/profile
// @desc    create or edit user profile
// @access  Private
router.post("/", passport.authenticate("jwt", {session: false}), (req, res) => {
  const {errors, isValid} = validateProfileInput(req.body);

  // check validation
  if(!isValid) {
    // return errors with 400 status
    return res.status(400).json(errors);
  }

  const newProfile = {
    user: req.user._id
  };
  
  if(req.body.handle)  newProfile.handle = req.body.handle;
  if(req.body.company)  newProfile.company = req.body.company;
  if(req.body.website)  newProfile.website = req.body.website;
  if(req.body.location)  newProfile.location = req.body.location;
  if(req.body.bio)  newProfile.bio = req.body.bio;
  if(req.body.status)  newProfile.status = req.body.status;
  if(req.body.githubusername)  newProfile.githubusername = req.body.githubusername;
  
  // skills - split into array
  if(typeof req.body.skills !== "undefined") {
    newProfile.skills = req.body.skills.split(",");
  }

  // social 
  newProfile.social = {};
  if(req.body.youtube)  newProfile.social.youtube = req.body.youtube;
  if(req.body.facebook)  newProfile.social.facebook = req.body.facebook;
  if(req.body.twitter)  newProfile.social.twitter = req.body.twitter;
  if(req.body.linkedin)  newProfile.social.linkedin = req.body.linkedin;
  if(req.body.nstagram)  newProfile.social.instagram = req.body.instagram;
  
  Profile.findOne({user: req.user._id})
    .then(profile => {
      if(profile) {
        // update profile (no create)
        Profile.findOneAndUpdate({user: req.user._id}, {$set: newProfile}, {new: true})
          .then(updatedProfile => res.json(updatedProfile))
          .catch(err => console.log("Error on updating profile",err));
      } else {
        // create profile (no update)
        

        // check if handle exist
        Profile.findOne({handle: newProfile.handle})
          .then(profile => {
            if(profile) {
              errors.handle = "That handle already exists"
              res.status(400).json("handle errors",errors);
            } else {
              Profile.create(newProfile) 
                .then(createdProfile => res.json(createdProfile))
                .catch(err => console.log("Error on creating new profile",err));
            }
          })
          .catch(err => console.log("Errormon finding handle profile",err));
      }
    });
});


module.exports = router;