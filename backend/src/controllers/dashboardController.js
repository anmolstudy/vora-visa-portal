export const dashboard = (req, res) => {
  const role = req.user.role;

  if (role === "admin") {
    return res.status(200).json({
      message: "Welcome Admin Dashboard",
      user: req.user,
    });
  }

  if (role === "employee") {
    return res.status(200).json({
      message: "Welcome Employee Dashboard",
      user: req.user,
    });
  }

  return res.status(403).json({ message: "Access denied" });
};
