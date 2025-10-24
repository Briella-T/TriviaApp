describe("Delete Functionality", () => {
    it("should successfully delete an item with a valid ID", () => {
        const itemId = 1;
        const result = deleteItem(itemId);
        expect(result).toBe(true);
    });

    it("should fail to delete an item with an invalid ID", () => {
        const itemId = 999;
        const result = deleteItem(itemId);
        expect(result).toBe(false);
    });
});

function deleteItem(itemId) {
    const validItemIds = [1, 2, 3];
    return validItemIds.includes(itemId);
}