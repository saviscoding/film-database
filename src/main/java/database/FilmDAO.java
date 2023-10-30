package database;

import java.sql.Connection;
import java.sql.SQLException;
import java.util.ArrayList;

import models.Film;

import java.sql.*;

public class FilmDAO {

	Film oneFilm = null;
	Connection conn = null;
	Statement stmt = null;
	String user = "savageda";
	String password = "lodreLan8";
	String url = "jdbc:mysql://mudfoot.doc.stu.mmu.ac.uk:6306/" + user;

	public FilmDAO() {

	}

	@SuppressWarnings("deprecation")
	private void openConnection() {
		// loading jdbc driver for mysql
		try {
			Class.forName("com.mysql.jdbc.Driver").newInstance();
		} catch (Exception e) {
			System.out.println(e);
		}

		// connecting to database
		try {
			// connection string for demos database, username demos, password demos
			conn = DriverManager.getConnection(url, user, password);
			stmt = conn.createStatement();
		} catch (SQLException se) {
			System.out.println(se);
		}
	}

	private void closeConnection() {
		try {
			conn.close();
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}

	private Film getNextFilm(ResultSet rs) {
		Film thisFilm = null;
		try {
			thisFilm = new Film(rs.getInt("id"), rs.getString("title"), rs.getInt("year"), rs.getString("director"),
					rs.getString("stars"), rs.getString("review"));
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return thisFilm;
	}

	/*
	 * LIST ALL FILMS
	 */

	public ArrayList<Film> getAllFilms(int pageSize, int offset) {
		
		
		ArrayList<Film> allFilms = new ArrayList<Film>();
		openConnection();

		// Create select statement and execute it
		try {
			String selectSQL = "select * from films limit " + offset + ", " + pageSize;
			ResultSet rs1 = stmt.executeQuery(selectSQL);

			// Retrieve the results
			while (rs1.next()) {
				oneFilm = getNextFilm(rs1);
				allFilms.add(oneFilm);
			}

			stmt.close();
			closeConnection();

		} catch (SQLException se) {
			System.out.println(se);
		}

		return allFilms;
	}

	/*
	 * SEARCH BY ID
	 */

	public Film getFilmByID(int id) {

		openConnection();
		oneFilm = null;
		// Create select statement and execute it
		try {
			String selectSQL = "select * from films where id=" + id;
			ResultSet rs1 = stmt.executeQuery(selectSQL);
			// Retrieve the results
			while (rs1.next()) {
				oneFilm = getNextFilm(rs1);
			}

			stmt.close();
			closeConnection();
		} catch (SQLException se) {
			System.out.println(se);
		}

		return oneFilm;
	}

	/*
	 * SEARCH FILM 
	 */

	public ArrayList<Film> getAllFilmsByKeyword(String searchText) {
		
		
		ArrayList<Film> matchedFilms = new ArrayList<Film>();
		openConnection();

		// create SELECT statement, execute and store results in array
		try {
			String selectSQL = "SELECT * FROM films WHERE title LIKE '%" + searchText + "%' OR director LIKE '%"
					+ searchText + "%' OR stars LIKE '%" + searchText + "%'";
			ResultSet rs1 = stmt.executeQuery(selectSQL);

			// Retrieve the results
			while (rs1.next()) {
				oneFilm = getNextFilm(rs1);
				matchedFilms.add(oneFilm);
			}

			stmt.close();
			closeConnection();
		} catch (SQLException se) {
			System.out.println(se);
		}
		return matchedFilms;
	}

	/*
	 * INSERT FILM
	 */

	public void insertFilm(Film film) {

		openConnection();

		String sql = "INSERT INTO films (id, title, year, director, stars, review) VALUES (?, ?, ?, ?, ?, ?)";

		try (

				PreparedStatement stmt = conn.prepareStatement(sql);

		) {
			// Set the values for the SQL query
			stmt.setInt(1, film.getID());
			stmt.setString(2, film.getTitle());
			stmt.setInt(3, film.getYear());
			stmt.setString(4, film.getDirector());
			stmt.setString(5, film.getStars());
			stmt.setString(6, film.getReview());

			// Execute the SQL query
			stmt.executeUpdate();
		} catch (SQLException se) {
			System.out.println(se);
		}
		closeConnection();
		return;
	}

	/*
	 * UPDATE FILM
	 */

	public void updateFilm(Film film) {

		openConnection();

		String sql = "UPDATE films SET title = ?, year = ?, director = ?, stars = ?, review = ? WHERE id = ?";

		try (PreparedStatement stmt = conn.prepareStatement(sql)) {
			stmt.setString(1, film.getTitle());
			stmt.setInt(2, film.getYear());
			stmt.setString(3, film.getDirector());
			stmt.setString(4, film.getStars());
			stmt.setString(5, film.getReview());
			stmt.setInt(6, film.getID());

			// Execute the SQL query
			stmt.executeUpdate();

		} catch (SQLException se) {
			System.out.println(se);
		}
		closeConnection();
		return;

	}

	/*
	 * DELETE FILM
	 */

	public void deleteFilm(int id) {

		openConnection();
		oneFilm = null;
		// Create select statement and execute it

		String sql = "DELETE FROM films WHERE id = ?";
		try (PreparedStatement stmt = conn.prepareStatement(sql)) {
			stmt.setInt(1, id);
			stmt.executeUpdate();

		} catch (SQLException se) {
			System.out.println(se);
		}
		closeConnection();
		return;

	}

}
