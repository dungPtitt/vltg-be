const functions = require('../../services/functions');
const newTV365 = require('../../models/Timviec365/Timviec/newTV365.model');

// so sánh lương
exports.findByCondition = async(req, res, next) => {
    try {
        Job.countDocuments({ salary: 5000 }, (error, count) => {
                if (error) {
                    console.error('Error counting documents:', error);
                } else {
                    console.log(`Number of jobs with salary 5000: ${count}`);
                }
            }).aggregate([{
                    $group: {
                        _id: null,
                        maxSalary: { $max: '$salary' },
                        minSalary: { $min: '$salary' },
                        avgSalary: { $avg: '$salary' },
                    },
                },
                {
                    $project: {
                        _id: 0,
                        maxSalary: 1,
                        minSalary: 1,
                        avgSalary: 1,
                    },
                },
            ])
            .exec((error, results) => {
                if (error) {
                    console.error('Error aggregating salaries:', error);
                } else {
                    const salaryStats = results[0];
                    console.log('Maximum salary:', salaryStats.maxSalary);
                    console.log('Minimum salary:', salaryStats.minSalary);
                    console.log('Average salary:', salaryStats.avgSalary);
                }
            });

    } catch (err) {
        return functions.setError(res, err.message, );
    };
};