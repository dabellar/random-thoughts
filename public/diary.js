/**
 * @author Darleine Abellard
 * CS 132 SP 2024 
 * CP4: Node/Express API
 * 
 * The JS file for random thoughts website
 * Includes both viewing and posting functionality
 */

(function() {
    "use strict";

    const BASE_URL = "/";

    /**
     * Adds event listeners to site
     */
    async function init() {
        let writeBtn = qs("#write-btn");
        writeBtn.addEventListener("click", () => {toggleView(writeBtn)});
        let viewBtn = qs("#view-btn");
        viewBtn.addEventListener("click", () => {toggleView(viewBtn)});
        await viewBtn.addEventListener("click", displayThoughts);
        id("thought-form").addEventListener("submit", async (evt) => {
            evt.preventDefault();
            await addNewThought();
        });
        id("thought-form").addEventListener("keydown", async (evt) => {
            if (evt.defaultPrevented) {
                return; 
            }
            if (evt.key == "Enter") {
                evt.preventDefault();
                await addNewThought();
            }
        });
        await filterThoughts();
    }

    /**
     * Switches the screen between the writing and viewing sections
     * @param {object} clickBtn button object (either write or view)
     */
    function toggleView(clickBtn) {
        if (clickBtn === qs("#write-btn")) {
            qs("#write").classList.remove("hidden");
            qs("#view").classList.add("hidden");
        } else {
            qs("#view").classList.remove("hidden");
            qs("#write").classList.add("hidden");
        }
    }

    async function filterThoughts() {
        let inputs = qsa("aside input");
        for (let i of inputs) {
            if (i.id === "all") {
                await i.addEventListener("click", displayThoughts);
            } else {
                await i.addEventListener("click", displaySpecificTopic);
            }
        }
    }

    /**
     * Retrieves the form data from #thought-form, 
     * posts the new thought, and displays a success 
     * or error message 
     */
    async function addNewThought() {
        let params = new FormData(id("thought-form"));
        try {
            let resp = await fetch(`${BASE_URL}newThought`, { method : "POST", body : params });
            resp = checkStatus(resp);
            let data = await resp.text();
            displayMsg(data);
        } catch (err) {
            handleError(err);
        }
    }

    /**
     * Gets all stored thoughts and creates an article card 
     * for DOM
     */
    async function displayThoughts() {
        try {
            let resp = await fetch(BASE_URL + "thoughts");
            resp = checkStatus(resp);
            const data = await resp.json();
            populateViewArea(data)
        } catch (err) {
            handleError(err);
        }
    }

    /**
     * Gets thoughts within a specific topic
     */
    async function displaySpecificTopic() {
        try {
            let selectedTopic = this.id;
            let resp = await fetch(BASE_URL + "thoughts/" + selectedTopic);
            const data = await resp.json();
            populateViewArea(data);
        } catch (err) {
            handleError(err);
        }
    }

    /**
     * Displays success or error message for #thought-form submission
     * 
     * @param {String} confirmMsg - message of either success or error
     */
    function displayMsg(confirmMsg) {
        let successCon = id("confirmation");
        successCon.textContent = confirmMsg;
        setTimeout(clearForm, 1000);
    }

    /****************************** HELPER FUNCTIONS ******************************/

    /**
     * Populates the #view container with thought articles
     * 
     * @param {Object} thoughtObj - a list of JSON objects of thought data
     */
    function populateViewArea(thoughtObj) {
        let viewCon = qs("#view section");
        clearViewArea();
        for (let obj of thoughtObj) {
            viewCon.appendChild(genViewArticle(obj))
        }
    }

    /**
     * Generates an article DOM element with thought data
     * 
     * @param {Object} thoughtInfo  one thought JSON obj
     * @return {DOMElement} the article element with thought data
     */
    function genViewArticle(thoughtInfo) {
        const article = gen("article");
        article.classList.add("past-thoughts");
        article.classList.add(`${thoughtInfo.topic}-card`);

        const pThought = gen("p");
        pThought.textContent = thoughtInfo.thought;
        article.appendChild(pThought);

        return article;
    }

    /**
     * Clear thought view area
     */
    function clearViewArea() {
        let viewArea = qs("#view section");
        while (viewArea.firstChild) {
            viewArea.removeChild(viewArea.firstChild);
        }
    }

    /**
     * Clears form and message area
     */
    function clearForm() {
        id("confirmation").textContent = "";
        id("thought-content").value = "";
    }

    init();
})();