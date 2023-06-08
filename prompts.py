SYSTEM_PROMPT = "You are a world class Python programmer."

GENERATOR_PROMPT_TEMPLATE = """
Task: Please review the following API documentation for {function_name}. Use the Python library hypothesis to write a
function that generates random values for the {parameter_name} object.
Make your function generates a wide variety of inputs and edge cases. Strictly follow the output format presented below.
"""

PBT_PROMPT_TEMPLATE = """
Task: Please review the following API documentation for {function_name}. Use the Python library hypothesis to write a
property test that generates random values for input parameter of {function_name}.
Make your function generate a wide variety of inputs and edge cases. Add assertions for each property to test. Strictly follow the output format presented below.
"""

OUTPUT_FORMAT_TEMPLATE = """
--------------------------- Output Format ---------------------------
```python
from hypothesis import strategies as st
import hypothesis.extra as extra 

# Summary: Summary of the generation strategy
@st.composite
def sample_{parameter_name}(draw):
    (...)
# End program
```
"""

PBT_OUTPUT_FORMAT_TEMPLATE = """
--------------------------- Output Format ---------------------------
```python
from hypothesis import given, strategies as st

# Summary: Summary of the generation strategy
@given(st.data())
def test_{function_name}():
    (...)
# End program
```
"""

PBT_EXAMPLE_OUTPUT_PROMPT = """
--------------------------- Example Output ---------------------------
```python
from hypothesis import given, strategies as st

@given(st.data())
def test_draw_sequentially(data):
    x = data.draw(integers())
    y = data.draw(integers(min_value=x))
    assert x < y
# End program
```
"""

EXAMPLE_OUTPUT_PROMPT = """
--------------------------- Example Output ---------------------------
```python
from hypothesis import strategies as st
import pandas as pd

# Summary:  Hypothesis strategy for generating pandas dataframes. Generate the number of rows and columns for the dataframe. Generate the column names and data types.  Generate the data for each column. Create the dataframe.
@st.composite
def sample_dataframe(draw):

    num_rows = draw(st.integers(min_value=1, max_value=10))
    num_cols = draw(st.integers(min_value=1, max_value=10))

    column_names = [draw(st.text(alphabet=st.characters(whitelist_categories=('Lu', 'Ll', 'Nd')), min_size=1, max_size=10)) for i in range(num_cols)]
    data_types = [draw(st.sampled_from([int, float, bool, str])) for i in range(num_cols)]
    dtypes = {{column_names[i]: data_types[i] for i in range(num_cols)}}

    data = [[draw(data_types[i]) for i in range(num_cols)] for j in range(num_rows)]

    df = pd.DataFrame(data, columns=column_names)
    df = df.astype(dtypes)

    return df
# End program
```
"""
API_PROMPT_TEMPLATE = """
--------------------------- API Documentation ---------------------------
{api_documentation}
"""
