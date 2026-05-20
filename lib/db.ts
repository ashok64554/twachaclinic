import mysql from "mysql2/promise";

const DEFAULT_DATABASE = "twachaclinic";

function databaseName() {
  if (process.env.DB_NAME) return process.env.DB_NAME;
  if (process.env.DATABASE_URL) {
    try {
      const parsed = new URL(process.env.DATABASE_URL);
      return parsed.pathname.replace("/", "") || DEFAULT_DATABASE;
    } catch {
      return DEFAULT_DATABASE;
    }
  }
  return DEFAULT_DATABASE;
}

function serverUrl() {
  if (process.env.DATABASE_URL) {
    const parsed = new URL(process.env.DATABASE_URL);
    parsed.pathname = "";
    return parsed.toString();
  }
  return `mysql://${process.env.DB_USER || "root"}:${process.env.DB_PASSWORD || ""}@${process.env.DB_HOST || "localhost"}:${process.env.DB_PORT || "3306"}`;
}

export async function getDbConnection() {
  const dbName = databaseName();
  const server = await mysql.createConnection(serverUrl());
  await server.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
  await server.end();

  const connectionUrl = process.env.DATABASE_URL || `${serverUrl()}/${dbName}`;
  const connection = await mysql.createConnection(connectionUrl);
  await ensureModuleTables(connection);
  return connection;
}

async function ensureModuleTables(connection: mysql.Connection) {
  await connection.query(`
    CREATE TABLE IF NOT EXISTS site_settings (
      setting_key VARCHAR(120) PRIMARY KEY,
      setting_value LONGTEXT NOT NULL,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
  `);
  await connection.query(`
    CREATE TABLE IF NOT EXISTS pages (
      id INT PRIMARY KEY,
      slug VARCHAR(180) NOT NULL UNIQUE,
      title VARCHAR(255) NOT NULL,
      eyebrow VARCHAR(180) NOT NULL,
      excerpt TEXT NOT NULL,
      image VARCHAR(500) NOT NULL,
      sections LONGTEXT NOT NULL,
      meta_title VARCHAR(255) NOT NULL,
      meta_description TEXT NOT NULL,
      active TINYINT(1) NOT NULL DEFAULT 1,
      display_order INT NOT NULL DEFAULT 0,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
  `);
  await connection.query(`
    CREATE TABLE IF NOT EXISTS doctors (
      id INT PRIMARY KEY,
      slug VARCHAR(180) NOT NULL UNIQUE,
      name VARCHAR(180) NOT NULL,
      title VARCHAR(220) NOT NULL,
      image VARCHAR(500) NOT NULL,
      summary TEXT NOT NULL,
      highlights LONGTEXT NOT NULL,
      active TINYINT(1) NOT NULL DEFAULT 1,
      display_order INT NOT NULL DEFAULT 0,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
  `);
  await connection.query(`
    CREATE TABLE IF NOT EXISTS services (
      id INT PRIMARY KEY,
      slug VARCHAR(180) NOT NULL UNIQUE,
      title VARCHAR(255) NOT NULL,
      category VARCHAR(180) NOT NULL,
      image VARCHAR(500) NOT NULL,
      excerpt TEXT NOT NULL,
      content LONGTEXT NOT NULL,
      benefits LONGTEXT NOT NULL,
      sections LONGTEXT NOT NULL,
      detail_html LONGTEXT,
      meta_title VARCHAR(255) NOT NULL,
      meta_description TEXT NOT NULL,
      active TINYINT(1) NOT NULL DEFAULT 1,
      display_order INT NOT NULL DEFAULT 0,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
  `);
  await connection.query(`
    CREATE TABLE IF NOT EXISTS videos (
      id VARCHAR(220) PRIMARY KEY,
      platform ENUM('youtube','instagram') NOT NULL,
      title VARCHAR(255) NOT NULL,
      url VARCHAR(700) NOT NULL,
      embed_url VARCHAR(700),
      thumbnail VARCHAR(500),
      service_slug VARCHAR(180),
      display_order INT NOT NULL DEFAULT 0,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
  `);
  await connection.query(`
    CREATE TABLE IF NOT EXISTS testimonials (
      id INT PRIMARY KEY,
      name VARCHAR(180) NOT NULL,
      note TEXT NOT NULL,
      rating INT NOT NULL DEFAULT 5,
      active TINYINT(1) NOT NULL DEFAULT 1,
      display_order INT NOT NULL DEFAULT 0,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
  `);
  await connection.query(`
    CREATE TABLE IF NOT EXISTS gallery_images (
      id INT PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      image VARCHAR(500) NOT NULL,
      active TINYINT(1) NOT NULL DEFAULT 1,
      display_order INT NOT NULL DEFAULT 0,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
  `);
  await connection.query(`
    CREATE TABLE IF NOT EXISTS appointments (
      id INT PRIMARY KEY AUTO_INCREMENT,
      name VARCHAR(180) NOT NULL,
      phone VARCHAR(80) NOT NULL,
      email VARCHAR(180),
      service VARCHAR(255),
      doctor VARCHAR(180),
      message TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
  `);
  await connection.query(`
    CREATE TABLE IF NOT EXISTS contact_leads (
      id INT PRIMARY KEY AUTO_INCREMENT,
      name VARCHAR(180) NOT NULL,
      phone VARCHAR(80) NOT NULL,
      email VARCHAR(180),
      message TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
  `);
  await connection.query(`
    CREATE TABLE IF NOT EXISTS admin_users (
      id INT PRIMARY KEY AUTO_INCREMENT,
      username VARCHAR(120) NOT NULL UNIQUE,
      email VARCHAR(180) NOT NULL UNIQUE,
      password_hash VARCHAR(255) NOT NULL,
      role VARCHAR(80) NOT NULL DEFAULT 'admin',
      active TINYINT(1) NOT NULL DEFAULT 1,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
  `);
  await addColumnIfMissing(connection, "doctors", "display_order", "INT NOT NULL DEFAULT 0");
  await addColumnIfMissing(connection, "services", "sections", "LONGTEXT");
  await addColumnIfMissing(connection, "services", "detail_html", "LONGTEXT");
  await addColumnIfMissing(connection, "services", "display_order", "INT NOT NULL DEFAULT 0");
  await addColumnIfMissing(connection, "testimonials", "display_order", "INT NOT NULL DEFAULT 0");
  await addColumnIfMissing(connection, "gallery_images", "display_order", "INT NOT NULL DEFAULT 0");
  await addColumnIfMissing(connection, "appointments", "doctor", "VARCHAR(180)");
}

async function addColumnIfMissing(connection: mysql.Connection, table: string, column: string, definition: string) {
  try {
    await connection.query(`ALTER TABLE \`${table}\` ADD COLUMN \`${column}\` ${definition}`);
  } catch (error) {
    const code = (error as { code?: string }).code;
    if (code !== "ER_DUP_FIELDNAME") throw error;
  }
}
