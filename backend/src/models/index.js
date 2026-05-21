module.exports = {
  sequelize: {
    sync: async () => {},
    close: async () => {}
  },
  Rol: {
    create: async (data) => ({ id: 1, ...data })
  },
  Usuario: {
    create: async (data) => ({ id: 1, ...data })
  }
};
