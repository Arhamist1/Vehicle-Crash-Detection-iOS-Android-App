import { Router } from "express";
import UserController from "../controller/UserController";

const router = Router();

// Request Parameters : username, password, emergencycontact
router.post(
  "/signup",
  UserController.signup
);

// Request Parameters : username, password
router.post(
  "/login",
  UserController.login
);

// Request Parameters : id, emergency contact
router.post(
  "/getallemergency",
  UserController.getallemergency
);
// Request Parameters : id, emergency contact
router.post(
  "/getallhospitals",
  UserController.getallhospitals
);

// Request Parameters : id, emergency contact
router.post(
  "/deleteEmergency",
  UserController.deleteEmergency
);

// Request Parameters : id, emergency contact
router.post(
  "/deletehospital",
  UserController.deletehospital
);

// Request Parameters : id, emergency contact
router.post(
  "/addemergency",
  UserController.addemergency
);

// Request Parameters : id, emergency contact
router.post(
  "/addhospital",
  UserController.addhospital
);
// Request Parameters : id, livelocation
router.post(
  "/emergency",
  UserController.emergencyoccured
);

export default router;