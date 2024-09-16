
# CS132 Creative Project 4 API Documentation
**Author:** Darleine Abellard
**Last Updated:** 06/19/2024

The Diary API provides functionality to retrieve and post data for a personal thought website. 

Clients can retrieve all previous thoughts posted and add more thoughts. 

Summary of endpoints:
  * GET /thoughts
  * GET /thoughts/:topic
  * POST /newThought
...

## *GET /thoughts*
**Returned Data Format**: JSON

**Description:**
Returns a list of JSON object of all the posted thoughts

**Example Request:** `thoughts`

**Example Response:**
```json
[
    {
        topic : academic,
        thought : I think I failed my exam.
    }, 
    {
        topic : positive,
        thought : I got a compliment on my necklace today.
    },
    {
        topic :  miscellaneous,
        thought : buy froot loops
    }
]
```

## *GET /thoughts/:topic*
**Returned Data Format**: JSON

**Description:** 
Returns a list of JSON objects of all the posted thoughts within a certain  

**Supported parameters**
* /:topic (required)
  * Topic name for thoughts.

**Example Request:** `/thoughts/negative` or `/thoughts/Negative`

**Example Response:**
```json
[
    {
        topic : negative,
        thought : I hate tea
    }, 
    {
        topic : negative, 
        thought : My roommate is getting on my nerves
    }, 
    {
        topic : negative,
        thought : I burned my hand in the toaster oven this morning.
    }
]
```

**Error Handling:**
* 400: Invalid request if given a topic that does not exist

**Example Request:** `/thought/badcategory`

**Example Response:**
```Not a valid topic for /thoughts/:topic```


## *POST /newThought*
**Returned Data Format**: Plain Text

**Description:** 
Sends information for a new thought including topic and thought content

**Supported Parameters**
* POST body parameters: 
  * `topic` (required) - selected topic
  * `thought_content` (required) - thought content

**Example Request:** `/newThought`
* POST body parameters: 
  * `topic= 'crochet'`
  * `thought_content= 'granny square skirt'`

**Example Response:**
```You successfully added a new thought!```

**Error Handling:**
* 400: Invalid request missing required `topic` or `thought_content` parameter.

**Example Request:** `/newThought`
* POST body parameters: 
  * `topic='writing'`

**Example Response:**
```All fields (topic and content) are required for /newThought```