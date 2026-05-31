const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const authService = {
  async register(fullname, email, password) {
    await delay(500);
    const users = JSON.parse(localStorage.getItem("users_db") || "[]");

    if (users.find((u) => u.email === email)) {
      throw new Error("Email already exists");
    }

    const newUser = {
      id: crypto.randomUUID(),
      fullname,
      email,
      password,
      phone: "",
      country: "",
      city: "",
      postalCode: "",
      createdAt: new Date().toISOString,
    };

    users.push(newUser);
    localStorage.setItem("users_db", JSON.stringify(users));

    const { password: _, ...userWithoutPass } = newUser;
    localStorage.setItem("current_user", JSON.stringify(userWithoutPass));
    return userWithoutPass;
  },

  async login(email, password) {
    await delay(500);

    const users = JSON.parse(localStorage.getItem("users_db") || "[]");
    const user = users.find(
      (u) => u.email === email && u.password === password,
    );

    if (!user) throw new Error("Invalid Credentials");

    const { password: _, ...userWithoutPass } = user;
    localStorage.setItem("current_user", JSON.stringify(userWithoutPass));
    return userWithoutPass;
  },

  logout() {
    localStorage.removeItem("current_user");
  },
};
