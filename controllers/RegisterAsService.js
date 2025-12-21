// import { Request, Response } from 'express';
// import {ServiceModel} from '../models/Services.js';
// import { uploadToCloudinary } from '../utils/cloudinary'; // Assuming you have cloudinary setup
import { sendRegistrationEmail } from '../utils/emailService.js';
import { ServiceModel } from '../models/user.model.js';
// import { sendRegistrationEmail } from '../utils/emailService';

export const registerAsService = async (req, res) => {
  try {
    const { email, phoneNumber, experience, category, skill } = req.body;
    
    // Check if user already exists
    const existingService = await ServiceModel.findOne({ 
      $or: [{ email }, { phoneNumber }] 
    });

    if (existingService) {
      return res.status(400).json({
        success: false,
        message: 'Service provider already registered with this email or phone number'
      });
    }

    // Validate required fields
    if (!email || !phoneNumber || !category || !skill) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    // Validate phone number
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(phoneNumber)) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid Indian phone number'
      });
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid email address'
      });
    }

    // Handle file upload if present
    // let aadharUrl = '';
    // if (req.file) {
    //   try {
    //     const uploadResult = await uploadToCloudinary(req.file, 'aadhar_documents');
    //     aadharUrl = uploadResult.secure_url;
    //   } catch (uploadError) {
    //     console.error('Aadhar upload error:', uploadError);
    //     return res.status(500).json({
    //       success: false,
    //       message: 'Failed to upload Aadhar document'
    //     });
    //   }
    // } else if (req.body.aadharUpload) {
    //   // If aadharUpload is sent as base64 string
    //   aadharUrl = req.body.aadharUpload;
    // } else {
    //   return res.status(400).json({
    //     success: false,
    //     message: 'Aadhar document is required'
    //   });
    // }

    // Create new service provider
    const newService = new ServiceModel({
      email,
      phoneNumber,
      experience: experience || 0,
      category,
      skill,
    //   aadharUpload: aadharUrl,
      registrationDate: new Date(),
      isVerified: false,
      status: 'pending' // pending, approved, rejected
    });

    await newService.save();

    // Send registration email
    try {
      await sendRegistrationEmail(email, {
        name: skill, // You can adjust this based on your data
        category,
        registrationDate: new Date().toLocaleDateString()
      });
    } catch (emailError) {
      console.error('Failed to send registration email:', emailError);
      // Don't fail the registration if email fails
    }

    // Return success response
    res.status(201).json({
      success: true,
      message: 'Registration successful! Your account is under review.',
      data: {
        id: newService._id,
        email: newService.email,
        phoneNumber: newService.phoneNumber,
        category: newService.category,
        skill: newService.skill,
        status: newService.status,
        registrationDate: newService.registrationDate
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    
    // Handle duplicate key errors
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Duplicate entry. Email or phone number already exists.'
      });
    }

    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      });
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};