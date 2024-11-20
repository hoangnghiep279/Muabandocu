import React from "react";

function Contact() {
  return (
    <main className="container py-9">
      <div className="bg-white rounded-lg shadow-lg p-8 ">
        <h2 className="text-3xl font-bold">Contact Us</h2>
        <form className="mt-8">
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="name"
            >
              Name:
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="text"
              id="name"
              name="name"
              required
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="email"
            >
              Email:
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="email"
              id="email"
              name="email"
              required
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="message"
            >
              Message:
            </label>
            <textarea
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="message"
              name="message"
              rows="4"
              required
            ></textarea>
          </div>
          <button
            className="bg-primaryColor hover:bg-[#005d6312] hover:text-black hover:border hover:border-primaryColor  text-white font-bold py-2 px-6 rounded"
            type="submit"
          >
            Submit
          </button>
        </form>
      </div>
    </main>
  );
}

export default Contact;
