# Seal Take-home Product Challenge

Congratulations! This is the last stage before the final interview. It's your opportunity show your product skills, so we weight it very highly.

## How to complete this stage of the interview process

1. Please clone this repo into your own private repo
2. Complete the 'Seal product problem' below
4. Invite _hfmw_ to view the repo & put a link in the form [here](https://forms.gle/E9LASH1Nyhoa3pu48)

## Seal product problem

Scientists are automatically uploading their data from bioreactors into Seal. To help you, some example data is already loaded into a table.

In the example data, each row shows the density of the cells and the total volume in the bioreactor at a given point in time.

The scientists want to calculate the cell count at any point in time, as well as being able to see the maximum cell count.

Instead of building in these features, we have identified two higher level features to build which would solve their problem, and would be useful to all of our customers:

1. `Calculation columns`, these are columns in the table that are populated based on a user defined formula e.g. A cell count column that is created by the formula: `Cell Density * Volume` 
2.  A `Column Aggregations` feature which allows a user to perform operations on a selected data column, such as showing the `Maximum Density`, `Minimum Cell Count`, etc...

You have a meeting scheduled with the scientist who is a customer. Build something they will be use on your laptop to give you feedback. Please use <a href="https://blueprintjs.com/">Blueprintjs</a>.

Put any notes and your instructions in the README as well as what you would do next to improve this. Please also answer how you would make it possible to do `Rate of change calculations` e.g. `Rate of Cell Count Growth`

#### FAQS

- Not sure about something? Please ask! Email will@seal.run.
- How should I communicate? Please over communicate. Please ask questions.
- What are you looking for? The goal is to get feedback on the features specified. It needs to deliver the specified features well, being easy to use and making a good impression on the customer.
- Unsure whether to submit? Would you be happy to sit next to a customer and let them test it on your laptop?
- Ran out of time? Make this clear in the readme, and write out what you would do next.

#### Personal Comments

##### How to use

To use the service, simply select the columns that interests you and press the "add calculation column" or "add aggregation column"
Once the menu opens, please select a name for your new Column and what kind of mathematical operation you want to execute.

A sample calculation should be shown to you once you open the menu, as well as a sample name.

##### Future work

Due to being incredibly busy with work, I dashed out a quick preview of my work, in the future I would like to implement the deletion and update of columns and the possibility to select aggregation columns for operations.

##### Rate of growth
Regard ing the rate of growth, I'd store information about the previous Cell during rendering as to use it to compare it with the one before and thus calculate a sort of rate of growth, the simples way to do so, would be to create a new column with data about the previous cells, and use a calculation column to do the subtraction.

At a certain point, I believe it would be better to just use Excel, which comes with all these features out of the box.