import csv

def convert_csv(input_file, output_file):
    with open(input_file, 'r', encoding='cp866') as file:
        reader = csv.reader(file, delimiter=';')
        data = list(reader)

    with open(output_file, 'w', encoding='utf-8', newline='') as file:
        writer = csv.writer(file, delimiter=';')
        writer.writerows(data)

# Пример использования:
input_csv = 'temp/1.csv'
output_csv = 'TimeTable.csv'

convert_csv(input_csv, output_csv)
