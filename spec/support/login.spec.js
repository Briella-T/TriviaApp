describe("Login Functionality", () => {
    it("should successfully log in with valid credentials", () => {
        const username = "testuser@email";
        const password = "password123";
        const result = login(username, password);
        expect(result).toBe(true);
    });

    it("should fail to log in with invalid credentials", () => {
        const username = "testuser";
        const password = "wrongpassword";
        const result = login(username, password);
        expect(result).toBe(false);
    });
});

function login(username, password) {
    const validUsername = "testuser@email";
    const validPassword = "password123";
    return username === validUsername && password === validPassword;
}