const router = require("express").Router();
const userController = require("../controllers/userControllers");
const { catchErrors } = require("../handlers/errorHandlers");

router.post("/login", catchErrors(userController.login));
router.post("/register", catchErrors(userController.register));
router.get("/logout", userController.logout);
router.post("/users", userController.getUsersWithChatIds);
router.post("/reset-password",catchErrors(userController.requestPasswordReset));
router.post("/reset-password/confirm", catchErrors(userController.verifyResetToken));
router.post("/reset-password/change", catchErrors(userController.updatePassword));
module.exports = router;
