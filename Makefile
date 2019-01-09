venv/lib/python3.*/site-packages/pyquery: venv
	./venv/bin/pip install -r requirements.txt
	
venv:
	python3 -m venv venv
