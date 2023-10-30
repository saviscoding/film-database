package controllers;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.stream.Collectors;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.xml.stream.XMLOutputFactory;
import javax.xml.stream.XMLStreamException;
import javax.xml.stream.XMLStreamWriter;

import org.json.JSONObject;

import database.FilmDAO;
import models.Film;
import com.google.gson.Gson;

@WebServlet("/film-api")
public class FilmRestApi extends HttpServlet {
	private static final long serialVersionUID = 1L;

	public FilmRestApi() {
		super();
		// TODO Auto-generated constructor stub
	}

	/*
	 * SEARCH
	 */

	protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		
		//create data access object instance, array list for films, and new film object
		FilmDAO dao = new FilmDAO();
		ArrayList<Film> films = new ArrayList<>();
		Film searchFilm = new Film();

		// Determine the requested search response
		String searchType = req.getParameter("searchType");
		String searchText = req.getParameter("searchText");
		String p = req.getParameter("page");
		int page = 1;
		if (p != null) {
			page = Integer.parseInt(p);
		}

		if (searchType.equalsIgnoreCase("show-all-films")) {
			// Retrieve the specified page of film data
			int pageSize = 10;
			int offset = (page - 1) * pageSize; // Calculate the zero-based offset for the SQL query
			films = dao.getAllFilms(pageSize, offset);
			//search by id
		} else if (searchType.equalsIgnoreCase("search-by-id")) {
			int id = Integer.parseInt(searchText);
			searchFilm = dao.getFilmByID(id);
			films.add(searchFilm);
			//search by keyword
		} else if (searchType.equalsIgnoreCase("search-by-keyword")) {
			films = dao.getAllFilmsByKeyword(searchText);
		}

		// Determine the requested response format
		String format = req.getParameter("format");
		if (format == null) {
			format = "json";
		}

		// Set the response type
		if (format.equalsIgnoreCase("json")) {
			resp.setContentType("application/json");
		} else if (format.equalsIgnoreCase("xml")) {
			resp.setContentType("application/xml");
		} else {
			resp.setContentType("text/plain");
		}

		/*
		 * CONVERT TO SPECIFIED FORMAT
		 */

		// Convert the list of films to JSON
		if (format.equalsIgnoreCase("json")) {

			Gson gson = new Gson();
			String json = gson.toJson(films);
			PrintWriter out = resp.getWriter();
			out.println(json);

			// Convert the list of films to XML
		} else if (format.equalsIgnoreCase("xml")) {
			try {

				XMLStreamWriter xmlWriter = XMLOutputFactory.newInstance().createXMLStreamWriter(resp.getWriter());

				// start the XML doc
				xmlWriter.writeStartDocument();

				// start the films element
				xmlWriter.writeStartElement("films");

				// Write each <film> element
				for (Film film : films) {
					xmlWriter.writeStartElement("film");
					xmlWriter.writeAttribute("id", String.valueOf(film.getID()));
					xmlWriter.writeAttribute("title", film.getTitle());
					xmlWriter.writeAttribute("year", String.valueOf(film.getYear()));
					xmlWriter.writeAttribute("director", film.getDirector());
					xmlWriter.writeAttribute("stars", film.getStars());
					xmlWriter.writeAttribute("review", film.getReview());
					xmlWriter.writeEndElement();
				}

				// close the films element
				xmlWriter.writeEndElement();

				// close the XML document
				xmlWriter.writeEndDocument();

				xmlWriter.close();

			} catch (XMLStreamException e) {
				// Code to handle the XMLStreamException
			}

			// Convert the list of films to plain text
		} else {
			String text = films.toString();
			resp.getWriter().write(text);
		}

	}

	/*
	 * ADD
	 */
	
	@Override
	protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		
		int id = Integer.parseInt(req.getParameter("id"));
		String title = req.getParameter("title");
		int year = Integer.parseInt(req.getParameter("year"));
		String director = req.getParameter("director");
		String stars = req.getParameter("stars");
		String review = req.getParameter("review");

		// Add the film to the database
		Film film = new Film(id, title, year, director, stars, review);
		FilmDAO dao = new FilmDAO();
		dao.insertFilm(film);
		PrintWriter out = resp.getWriter();
		resp.setStatus(HttpServletResponse.SC_OK);
		out.write("film added");
		out.close();
	}

	/*
	 * UPDATE
	 */

	@Override
	protected void doPut(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {

		// get parameters entered from user
		int id = Integer.parseInt(req.getParameter("id"));
		String title = req.getParameter("title");
		int year = Integer.parseInt(req.getParameter("year"));
		String director = req.getParameter("director");
		String stars = req.getParameter("stars");
		String review = req.getParameter("review");

		Film film = new Film(id, title, year, director, stars, review);
		FilmDAO dao = new FilmDAO();
		PrintWriter out = resp.getWriter();
		dao.updateFilm(film);
		resp.setStatus(HttpServletResponse.SC_OK);
		out.write("film updated");
		out.close();
	}

	/*
	 * DELETE
	 */

	@Override
	protected void doDelete(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {

		int id = Integer.parseInt(req.getParameter("id"));
		FilmDAO dao = new FilmDAO();
		PrintWriter out = resp.getWriter();
		dao.deleteFilm(id);
		out.write("film deleted");
		out.close();
	}

}
