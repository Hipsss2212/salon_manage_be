import { processRequestBody } from "zod-express-middleware";
import { z } from "zod";

const loginDemoSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

const loginDemo = [
  processRequestBody(loginDemoSchema),
  async (req, res) => {
    const { username, password } = req.body;
    // Giả lập xác thực, chỉ cần username và password không rỗng
    if (!username || !password) {
      return res.status(400).json({ message: "Missing credentials" });
    }
    // Trả về token giả lập
    return res.status(200).json({
      accessToken: "demo-token-123456",
      user: { username },
    });
  },
];

const logoutDemo = [
  async (req, res) => {
    // Đơn giản chỉ trả về thành công
    return res.status(200).json({ message: "Logged out (demo)" });
  },
];

export default {
  loginDemo,
  logoutDemo,
}; 