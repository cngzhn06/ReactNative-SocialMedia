const express = require("express");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "Email kullanılıyor" });
    }

    const newUser = new User({ name, email, password });

    newUser.verificationToken = crypto.randomBytes(20).toString("hex");

    await newUser.save();

    sendVerificationEmail(newUser.email, newUser.verificationToken);

    res.status(200).json({ message: "Kayıt Başarılı" });
  } catch (error) {
    console.log("🚀 ~ register ~ error:", error);
    res.status(500).json({ message: "kayıt olma başarısız" });
  }
});

const sendVerificationEmail = async (email, verificationToken) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "cngzhnmt2@gmail.com",
      pass: `${process.env.PASS}`,
    },
  });

  const mailOptions = {
    from: "threads.com",
    to: email,
    subject: "Email Verification",
    text: `please click the following link to verify your email http://localhost:5010/user/verify/${verificationToken}`,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.log("error sending email", error);
  }
};

router.get("/verify/:token", async (req, res) => {
  try {
    const token = req.params.token;

    const user = await User.findOne({ verificationToken: token });
    if (!user) {
      return res.status(404).json({ message: "Invalid token" });
    }

    user.verified = true;
    user.verificationToken = undefined;
    await user.save();

    res.status(200).json({ message: "Email verified successfully" });
  } catch (error) {
    console.log("error getting token", error);
    res.status(500).json({ message: "Email verification failed" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Email hatalı" });
    }

    if (user.password !== password) {
      return res.status(404).json({ message: "Şifre hatalı" });
    }

    const secretKey = generateSecretKey();
    const token = jwt.sign({ userId: user._id }, secretKey);

    res.status(200).json({ token });
  } catch (error) {
    console.log("🚀 ~ router.post ~ error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

const generateSecretKey = () => {
  const secretKey = crypto.randomBytes(32).toString("hex");
  return secretKey;
};

router.get("/user/:userId", (req, res) => {
  try {
    const loggedInUserId = req.params.userId;

    User.find({ _id: { $ne: loggedInUserId } })
      .then((users) => {
        res.status(200).json(users);
      })
      .catch((error) => {
        console.log("Error: ", error);
        res.status(500).json("errror");
      });
  } catch (error) {
    res.status(500).json({ message: "error getting the users" });
  }
});

router.post("/follow", async (req, res) => {
  const { currentUserId, selectedUserId } = req.body;

  try {
    await User.findByIdAndUpdate(selectedUserId, {
      $push: { followers: currentUserId },
    });

    res.sendStatus(200);
  } catch (error) {
    console.log("🚀 ~ router.post ~ error:", error);
    res.status(500).json({message: "kullanıcıyı takip ederken bir hata oluştu"})
  }
});

router.post("/users/unfollow", async (req, res) => {
  const { loggedInUserId, targetUserId } = req.body;
  try {
    await User.findByIdAndUpdate(targetUserId, {
      $pull: { followers: loggedInUserId },
    });

    res.status(200).json({ message: "Takipten çıkma başarılı" });
  } catch (error) {
    console.log("🚀 ~ router.post ~ error:", error)
    res.status(500).json({ message: "Geri takipten çıkarken bir hata oluştu" });
  }
});


router.get("/profile/:userId", async(req,res) => {
  try{
    const userId = req.params.userId;

    const user = await User.findById(userId);

    if(!user){
      return res.status(404).json({message:"kullanıcı bulunamadı"})
    }
    return res.status(200).json({user})
  }
  catch(error) {
  console.log("🚀 ~ router.get ~ error:", error)
  }
})


router.put('/update-username', async (req, res) => {
  const { userId, newUsername } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
    }

    user.name = newUsername;
    await user.save();

    res.status(200).json({ message: 'Kullanıcı adı güncellendi', user });
  } catch (error) {
    console.error('Kullanıcı adı güncellenirken hata:', error);
    res.status(500).json({ message: 'Kullanıcı adı güncellenemedi' });
  }
});

router.get("/followers/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    const user = await User.findById(userId).populate('followers', 'name email');
    if (!user) {
      return res.status(404).json({ message: "Kullanıcı bulunamadı" });
    }

    res.status(200).json(user.followers);
  } catch (error) {
    console.log("🚀 ~ error fetching followers:", error);
    res.status(500).json({ message: "Takipçi bilgileri alınamadı" });
  }
});


module.exports = router;
