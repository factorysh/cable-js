PYTHON_VERSION=$(shell python3 -V | grep  -o -e "3\.\d*")

venv/lib/python3.${PYTHON_VERSION}/site-packages/pyquery: venv
	./venv/bin/pip install -U pip wheel
	./venv/bin/pip install -r requirements.txt
	
venv:
	python3 -m venv venv

clean:
	rm -rf venv node_modules output

output:
	mkdir -p output

dessin: venv/lib/python3.${PYTHON_VERSION}/site-packages/pyquery output
	./venv/bin/python prepare.py > output/out.svg