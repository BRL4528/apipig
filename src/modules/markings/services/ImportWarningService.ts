// import csvParse from 'csv-parse';
// import fs from 'fs';
// import { inject, injectable } from 'tsyringe';
// import IWarningsRepository from '../repositories/IWarningsRepository';

// interface IRequest {
//   numcad: number;
//   datnot: Date;
//   notific: string;
// }

// @injectable()
// class ImportWarningService {
//   constructor(
//     @inject('WarningsRepository')
//     private warningsRepository: IWarningsRepository,
//   ) {}

//   public async execute(filePath: string): Promise<IRequest[]> {
//     const contactsReadStream = fs.createReadStream(filePath);

//     const parsers = csvParse({
//       from_line: 2,
//     });

//     const parseCSV = contactsReadStream.pipe(parsers);

//     const warnings: IRequest[] = [];

//     parseCSV.on('data', async line => {
//       const [numcad, datnot, notific] = line.map((cell: string) => cell.trim());

//       if (!numcad || !datnot || !notific) return;

//       warnings.push({
//         numcad,
//         datnot,
//         notific,
//       });
//     });

//     await new Promise(resolve => parseCSV.on('end', resolve));

//     const existentWarnings = await this.warningsRepository.findAllByNumcad(
//       warnings,
//     );

//     if (existentWarnings.length > 0) {
//       await this.warningsRepository.deleteAll(existentWarnings);
//     }

//     // const existentemployeesNumcad = existentEmployees.map(
//     //   (employee: Employee) => employee.numcad,
//     // );

//     // const addEmployeeNumcad = employees
//     //   .filter(employee => !existentemployeesNumcad.includes(employee.numcad))
//     //   .filter(
//     //     (value, index, self) =>
//     //       self.findIndex(employee => {
//     //         return employee.nomfunc === value.nomfunc;
//     //       }) === index,
//     //   );

//     // const updateEmployeeNumcad = employees
//     //   .filter(employee => existentemployeesNumcad.includes(employee.numcad))
//     //   .filter(
//     //     (value, index, self) =>
//     //       self.findIndex(employee => {
//     //         return employee.nomfunc === value.nomfunc;
//     //       }) === index,
//     //   );

//     // const updatedEmployees = this.WarningsRepository.updateAll(
//     //   updateEmployeeNumcad,
//     // );

//     const newWarnings = this.warningsRepository.createAll(warnings);

//     await fs.promises.unlink(filePath);

//     // return employees;
//     return newWarnings;
//   }
// }

// export default ImportWarningService;
