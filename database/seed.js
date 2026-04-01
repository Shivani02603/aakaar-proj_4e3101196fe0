const { sequelize, Note } = require('./models');
require('dotenv').config();

async function seed() {
  try {
    await sequelize.authenticate();
    console.log('Database connected to:', process.env.DATABASE_URL);

    await Note.destroy({ where: {} });
    console.log('Cleared existing notes');

    const notes = [
      { title: 'First note', content: 'This is the content of the first note.' },
      { title: 'Shopping list', content: 'Buy milk, eggs, bread.' },
      { title: 'Meeting agenda', content: 'Discuss project timeline and deliverables.' }
    ];

    const createdNotes = await Note.bulkCreate(notes);
    console.log(`Seeded ${createdNotes.length} notes:`);
    createdNotes.forEach(note => {
      console.log(`  - ${note.title}`);
    });
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  } finally {
    await sequelize.close();
    console.log('Database connection closed');
  }
}

seed();