# Document structure
ElasticSearch is used as a database for the documents as well as the searching engine.

## Document image
When the crawler retrieves a document a document image is created.

All document images **MUST** have at least:
* id (internal)
* document_id
* parent_id
* branch_id (root)
* status (enum)
* version (string)
* title (string)
* original_href (string)
* copy_href (string)
* authors (array of strings)
* publication (string)
* publisher (string)
* publication_date (date)
* crawler_date (date)
* crawler_agent (string)
* state (string)
* city (string)
* content (string)

`id` is used to identify the image of a document, generically, and internally.

`document_id` is a code used to identify the given document publicly, not related to a specific version.

`branch_id` is a code used to identify the document

`original_href` is the web address to the original document. There might be odd cases of contents not available directly via a web link. The original_path should be either empty or something relevant for these.

`copy_href` is the web address to a stored version of the original file available to anyone.

`parent_id` refers to the document of origin (i.e., old version).

`branch_id` refers to a list of history for a given document.

`status` is a flag to indicate if the document should be searchable or not.

`publication` is the news outlet, area, paper, or source of the information.

`publisher` is the entity responsible for the publication.

## Document branch
A document branch is a simple list of document images. The branch is created just before the first entry for a given document_id is created and documents are added to it whenever a new document image is put on the system.

## Operations (create & read mostly)
The document search system is designed for insertion and reading only. Deletions are not performed normally. Updates are expected to be minimal and mostly for state changes (such as setting the status of a document to not searchable).
